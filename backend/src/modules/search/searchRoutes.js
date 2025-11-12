const express = require('express');
const router = express.Router();
const searchController = require('../searchController');

// Search items with filters
router.get('/search', searchController.searchItems);

// Search suggestions
router.get('/search/suggestions', searchController.getSuggestions);

// Faculties filter
router.get('/filters/faculties', searchController.getFaculties);

module.exports = router;
