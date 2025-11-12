const messageService = require('./messageService');

async function listConversations(req, res, next) {
  try {
    const conversations = await messageService.listUserConversations(req.userId);
    res.json({ conversations });
  } catch (error) {
    next(error);
  }
}

async function createConversation(req, res, next) {
  try {
    const { participantId, itemId } = req.body || {};
    if (!participantId) {
      return res.status(400).json({ message: 'participantId จำเป็น' });
    }

    const conversation = await messageService.createConversation({
      itemId,
      userId: req.userId,
      participantId: Number(participantId),
    });

    res.status(201).json({ conversation });
  } catch (error) {
    next(error);
  }
}

async function listMessages(req, res, next) {
  try {
    const conversationId = Number(req.params.conversationId);
    if (Number.isNaN(conversationId)) {
      return res.status(400).json({ message: 'conversationId ไม่ถูกต้อง' });
    }

    let before = null;
    if (req.query.before) {
      const parsed = new Date(req.query.before);
      if (!Number.isNaN(parsed.getTime())) {
        before = parsed;
      }
    }

    const messages = await messageService.listConversationMessages({
      conversationId,
      userId: req.userId,
      before,
      limit: Number(req.query.limit) || 50,
    });

    res.json({ messages });
  } catch (error) {
    next(error);
  }
}

async function sendMessage(req, res, next) {
  try {
    const conversationId = Number(req.params.conversationId);
    if (Number.isNaN(conversationId)) {
      return res.status(400).json({ message: 'conversationId ไม่ถูกต้อง' });
    }

    const { text } = req.body || {};
    const message = await messageService.sendMessage({
      conversationId,
      senderId: req.userId,
      text,
    });

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listConversations,
  createConversation,
  listMessages,
  sendMessage,
};
