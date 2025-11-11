const express = require('express');
const router = express.Router();
const searchController = require('../searchController');

router.get('/', searchController.searchItems);
router.get('/suggestions', searchController.getSuggestions);

module.exports = router;
