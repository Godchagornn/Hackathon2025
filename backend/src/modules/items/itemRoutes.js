const express = require('express');
const router = express.Router();
const itemController = require('../itemController');
const { protect } = require('../../../middleware/authMiddleware');

// Public feed routes
router.get('/', itemController.getItems); // GET /api/items?page=&limit=&category=&faculty=
router.get('/featured', itemController.getFeatured); // GET /api/items/featured
router.get('/categories', itemController.getCategories); // GET /api/items/categories
router.get('/:itemId', itemController.getItemById); // GET /api/items/:itemId

// Recommended items (protected)
router.get('/recommended', protect, itemController.getRecommended);

// CRUD routes (protected)
router.post('/', protect, itemController.createItem);
router.put('/:itemId', protect, itemController.updateItem);
router.delete('/:itemId', protect, itemController.deleteItem);

module.exports = router;
