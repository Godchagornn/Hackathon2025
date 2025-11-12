const notificationModel = require('./notificationModel');
const profileModel = require('../profile/profileModel');
const mailer = require('../../lib/mailer');

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function escapeHtml(value) {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pickFirstImage(images) {
  if (Array.isArray(images) && images.length > 0) {
    return images[0];
  }
  return null;
}

function mapNotification(row, userId) {
  const isOwner = row.owner_id === userId;
  const direction = isOwner ? 'incoming' : 'outgoing';

  const counterpart = isOwner
    ? {
        name: row.requester_name || row.requester_email,
        avatar: row.requester_avatar,
        faculty: row.requester_faculty,
      }
    : {
        name: row.owner_name || row.owner_email,
        avatar: row.owner_avatar,
        faculty: row.owner_faculty,
      };

  const offerItem = row.offer_item_id
    ? {
        title: row.offer_item_title,
        image: pickFirstImage(row.offer_item_images) || 'https://placehold.co/300x200?text=Offer',
        category: row.offer_item_category || 'Item',
        condition: row.offer_item_condition || 'unknown',
      }
    : {
        title: 'Custom offer',
        image: 'https://placehold.co/300x200?text=Offer',
        category: 'N/A',
        condition: 'N/A',
      };

  const targetItem = {
    title: row.target_item_title,
    image: pickFirstImage(row.target_item_images) || 'https://placehold.co/300x200?text=Item',
  };

  const hasExchange = Boolean(row.exchange_code);

  return {
    id: row.id.toString(),
    type: 'exchange_request',
    direction,
    fromUser: counterpart,
    offerItem,
    targetItem,
    message: row.message || '',
    timestamp: row.created_at ? new Date(row.created_at).toISOString() : null,
    status: row.status,
    bothPartiesAccepted: hasExchange,
    exchangeCode: row.exchange_code || undefined,
  };
}

async function listNotificationsForUser(userId) {
  const rows = await notificationModel.findNotificationsByUserId(userId);
  return rows.map((row) => mapNotification(row, userId));
}

async function getSingleNotification(userId, requestId) {
  const row = await notificationModel.findNotificationByIdForUser(userId, requestId);
  if (!row) return null;
  return mapNotification(row, userId);
}

function generateExchangeCode() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `XC-${random}`;
}

async function acceptRequest({ userId, requestId }) {
  const request = await notificationModel.findRequestById(requestId);
  if (!request) {
    throw createHttpError('Notification not found', 404);
  }

  if (request.owner_id !== userId) {
    throw createHttpError('Only the item owner can accept this request', 403);
  }

  if (request.status === 'rejected') {
    throw createHttpError('Request has already been rejected');
  }

  if (request.status === 'completed') {
    throw createHttpError('Request already completed');
  }

  const exchangeCode = generateExchangeCode();
  await notificationModel.updateRequestStatus(requestId, 'accepted');
  await notificationModel.upsertExchange(requestId, exchangeCode);

  return getSingleNotification(userId, requestId);
}

async function rejectRequest({ userId, requestId }) {
  const request = await notificationModel.findRequestById(requestId);
  if (!request) {
    throw createHttpError('Notification not found', 404);
  }

  if (request.owner_id !== userId && request.requester_id !== userId) {
    throw createHttpError('You do not have access to this request', 403);
  }

  await notificationModel.updateRequestStatus(requestId, 'rejected');
  await notificationModel.deleteExchangeByRequestId(requestId);

  return getSingleNotification(userId, requestId);
}

async function completeExchange({ userId, requestId, code }) {
  const request = await notificationModel.findRequestById(requestId);
  if (!request) {
    throw createHttpError('Notification not found', 404);
  }

  if (request.requester_id !== userId) {
    throw createHttpError('Only the requester can confirm completion', 403);
  }

  if (request.status !== 'accepted') {
    throw createHttpError('Request must be accepted before completion');
  }

  const exchange = await notificationModel.getExchangeByRequestId(requestId);
  if (!exchange || exchange.exchange_code !== code) {
    throw createHttpError('Invalid exchange code', 400);
  }

  await notificationModel.updateRequestStatus(requestId, 'completed');
  await notificationModel.markExchangeCompleted(requestId);

  return getSingleNotification(userId, requestId);
}

async function createExchangeRequestNotification({
  ownerId,
  requesterId,
  itemId,
  message,
  offer,
}) {
  const owner = await profileModel.findUserById(ownerId);
  if (!owner) {
    throw createHttpError('Owner profile not found', 404);
  }

  const requester = await profileModel.findUserById(requesterId);
  if (!requester) {
    throw createHttpError('Requester profile not found', 404);
  }

  const item = await notificationModel.findItemById(itemId);
  if (!item) {
    throw createHttpError('Item not found', 404);
  }

  if (item.user_id !== ownerId) {
    throw createHttpError('Item does not belong to this profile', 400);
  }

  const newRequest = await notificationModel.createExchangeRequest({
    requesterId,
    ownerId,
    itemId,
    offeredItemId: offer?.offeredItemId || null,
    message,
  });

  const requesterName = requester.display_name || requester.email;
  const ownerName = owner.display_name || owner.email;
  const offerSummary = offer
    ? `
      <p><strong>ของที่เสนอแลก:</strong></p>
      <ul>
        <li>ชื่อ: ${escapeHtml(offer.title || 'ไม่ระบุ')}</li>
        <li>หมวดหมู่: ${escapeHtml(offer.category || '-')}</li>
        <li>สภาพ: ${escapeHtml(offer.condition || '-')}</li>
      </ul>
    `
    : '';

  const safeMessage = escapeHtml(message);
  const htmlBody = `
    <p>สวัสดี ${escapeHtml(ownerName)},</p>
    <p><strong>${escapeHtml(requesterName)}</strong> (${escapeHtml(requester.email)}) ส่งคำขอแลกเปลี่ยนสำหรับ "${escapeHtml(item.title)}".</p>
    <p><strong>ข้อความจากผู้ขอ:</strong></p>
    <blockquote style="border-left:4px solid #6B7280;padding-left:12px;color:#374151;">${safeMessage || '—'}</blockquote>
    ${offerSummary}
    <p>คุณสามารถตอบรับหรือปฏิเสธคำขอได้จากหน้า Notifications.</p>
    <p style="margin-top:24px;">CMU ShareCycle</p>
  `;

  await mailer.sendMail({
    to: owner.email,
    subject: `[CMU ShareCycle] ${requesterName} ขอแลก "${item.title}"`,
    html: htmlBody,
    text: `${requesterName} (${requester.email}) ขอแลก "${item.title}". ข้อความ: ${message}`,
  });

  return getSingleNotification(ownerId, newRequest.id);
}

module.exports = {
  listNotificationsForUser,
  acceptRequest,
  rejectRequest,
  completeExchange,
  createExchangeRequestNotification,
};
