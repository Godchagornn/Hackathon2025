const express = require('express');
const profileRoutes = require('../modules/profile/profileRoutes');
const notificationRoutes = require('../modules/notifications/notificationRoutes');
const itemRoutes = require('./modules/items/itemRoutes');

const router = express.Router();
const app = express();

app.use(express.json());
app.use('/api/items', itemRoutes);

// Search & Filter routes
router.get('/items/search', searchController.searchItems);
router.get('/search/suggestions', searchController.getSuggestions);
router.get('/filters/faculties', searchController.getFaculties);

router.use('/profiles/:profileId/notifications', notificationRoutes);
router.use('/profiles', profileRoutes);

module.exports = router;
