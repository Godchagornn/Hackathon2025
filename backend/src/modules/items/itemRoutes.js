const express = require('express');
const router = express.Router();
const itemController = require('../itemController');
const { protect } = require('../../../middleware/authMiddleware');

// GET routes ต้องไปหน้า POST routes
router.post('/', protect, itemController.createItem);
router.put('/:itemId', protect, itemController.updateItem);
router.delete('/:itemId', protect, itemController.deleteItem);

// Routes ที่ไม่ใช่ protected
router.get('/', itemController.getItems);
router.get('/:itemId', itemController.getItemById);

module.exports = router;