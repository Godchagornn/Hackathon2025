const express = require('express');
const profileRoutes = require('../modules/profile/profileRoutes');
const notificationRoutes = require('../modules/notifications/notificationRoutes');
const itemRoutes = require('../modules/items/itemRoutes');
const searchRoutes = require('../modules/search/searchRoutes');

const router = express.Router();

router.use('/items', itemRoutes);
router.use('/search', searchRoutes);

router.use('/profiles/:profileId/notifications', notificationRoutes);
router.use('/profiles', profileRoutes);

module.exports = router;
