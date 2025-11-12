const messageModel = require('./messageModel');
const profileModel = require('../profile/profileModel');
const mailer = require('../../lib/mailer');
const messageSocket = require('./socket');

function mapConversation(row, currentUserId) {
  return {
    id: row.id,
    itemId: row.item_id,
    itemTitle: row.item_title,
    itemImage: row.item_images?.[0] || null,
    counterpart: {
      id: row.counterpart_id,
      name: row.counterpart_name || 'CMU User',
      faculty: row.counterpart_faculty,
      avatar: row.counterpart_avatar,
    },
    lastMessage: row.last_message,
    unreadCount: Number(row.unread_count || 0),
    lastMessageAt: row.last_message_at,
    isOwner: row.user1_id === currentUserId,
  };
}

function mapMessage(row) {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    text: row.text,
    attachments: row.attachments || [],
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

async function listUserConversations(userId) {
  const rows = await messageModel.listConversations(userId);
  return rows.map((row) => mapConversation(row, userId));
}

async function ensureConversationAccess(conversationId, userId) {
  const conversation = await messageModel.findConversationById(conversationId);
  if (!conversation || (conversation.user1_id !== userId && conversation.user2_id !== userId)) {
    const error = new Error('ไม่พบห้องสนทนาหรือคุณไม่มีสิทธิ์เข้าถึง');
    error.statusCode = 404;
    throw error;
  }
  return conversation;
}

async function listConversationMessages({ conversationId, userId, before, limit }) {
  await ensureConversationAccess(conversationId, userId);
  const rows = await messageModel.listMessages(conversationId, limit, before);
  const messages = rows.map(mapMessage).reverse();
  await messageModel.markMessagesRead(conversationId, userId);
  return messages;
}

async function createConversation({ itemId, userId, participantId }) {
  if (userId === participantId) {
    const error = new Error('ไม่สามารถเปิดห้องสนทนากับตัวเองได้');
    error.statusCode = 400;
    throw error;
  }

  const { display_name: participantName } = (await profileModel.findUserById(participantId)) || {};
  if (!participantName) {
    const error = new Error('ไม่พบผู้ใช้ที่ต้องการสนทนาด้วย');
    error.statusCode = 404;
    throw error;
  }

  let conversation = await messageModel.findConversationWithParticipants(
    userId,
    participantId,
    itemId,
  );

  if (!conversation) {
    conversation = await messageModel.createConversation({
      itemId,
      userA: userId,
      userB: participantId,
    });
  }

  const rows = await messageModel.listConversations(userId);
  const full = rows.find((row) => row.id === conversation.id);
  return mapConversation(full, userId);
}

async function sendMessage({ conversationId, senderId, text }) {
  if (!text || !text.trim()) {
    const error = new Error('ข้อความห้ามว่าง');
    error.statusCode = 400;
    throw error;
  }

  const conversation = await ensureConversationAccess(conversationId, senderId);
  const trimmed = text.trim();

  const messageRow = await messageModel.insertMessage({
    conversationId,
    senderId,
    text: trimmed,
    attachments: [],
  });
  await messageModel.touchConversation(conversationId);
  await messageModel.markMessagesRead(conversationId, senderId);

  const participants = await messageModel.getConversationParticipants(conversationId);
  const recipientId = conversation.user1_id === senderId ? conversation.user2_id : conversation.user1_id;

  const mapped = mapMessage(messageRow);
  messageSocket.emitNewMessage(mapped, recipientId);

  const recipientProfile = await profileModel.findUserById(recipientId);
  const senderProfile = await profileModel.findUserById(senderId);

  if (recipientProfile?.email && mailer.isConfigured()) {
    const senderName = senderProfile?.display_name || senderProfile?.email || 'CMU ShareCycle';
    await mailer.sendMail({
      to: recipientProfile.email,
      subject: `[CMU ShareCycle] ข้อความใหม่จาก ${senderName}`,
      html: `
        <p>คุณมีข้อความใหม่จาก <strong>${senderName}</strong></p>
        <blockquote style="border-left:4px solid #d1e3d3;padding-left:12px;">${trimmed}</blockquote>
        <p>เข้าสู่ระบบเพื่อดูรายละเอียดเพิ่มเติม</p>
      `,
      text: `${senderName} ส่งข้อความถึงคุณ: ${trimmed}`,
    });
  }

  return mapped;
}

module.exports = {
  listUserConversations,
  listConversationMessages,
  createConversation,
  sendMessage,
};
