const express = require('express');
const profileRoutes = require('../modules/profile/profileRoutes');
const notificationRoutes = require('../modules/notifications/notificationRoutes');

const router = express.Router();

router.use('/profiles/:profileId/notifications', notificationRoutes);
router.use('/profiles', profileRoutes);

module.exports = router;
