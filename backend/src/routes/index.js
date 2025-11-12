const express = require('express');
const profileRoutes = require('../modules/profile/profileRoutes');
const notificationRoutes = require('../modules/notifications/notificationRoutes');
const itemRoutes = require('../modules/items/itemRoutes');
const itemController = require('../modules/items/itemController');

const router = express.Router();

router.use('/items', itemRoutes);
router.get('/categories', itemController.getCategories);

// Search & Filter routes
router.get('/items/search', searchController.searchItems);
router.get('/search/suggestions', searchController.getSuggestions);
router.get('/filters/faculties', searchController.getFaculties);

router.use('/profiles/:profileId/notifications', notificationRoutes);
router.use('/profiles', profileRoutes);

module.exports = router;
