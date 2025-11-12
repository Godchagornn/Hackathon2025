const express = require('express');
const profileRoutes = require('../modules/profile/profileRoutes');
const notificationRoutes = require('../modules/notifications/notificationRoutes');
const authRoutes = require('../modules/auth/authRoutes');
const itemsRoutes = require('../modules/items/itemRoutes');
const messagesRoutes = require('../modules/messages/messageRoutes');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/items', itemsRoutes);
router.use('/profiles/:profileId/notifications', requireAuth, notificationRoutes);
router.use('/profiles', requireAuth, profileRoutes);
router.use('/messages', messagesRoutes);

module.exports = router;
