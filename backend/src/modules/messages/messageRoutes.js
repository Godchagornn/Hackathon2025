const express = require('express');
const controller = require('./messageController');
const requireAuth = require('../../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/conversations', controller.listConversations);
router.post('/conversations', controller.createConversation);
router.get('/conversations/:conversationId/messages', controller.listMessages);
router.post('/conversations/:conversationId/messages', controller.sendMessage);

module.exports = router;
