const express = require('express');
const controller = require('./itemController');
const requireAuth = require('../../middleware/auth');

const router = express.Router();

router.get('/', controller.listItems);
router.get('/:itemId', controller.getItem);

router.post('/', requireAuth, controller.createItem);
router.patch('/:itemId', requireAuth, controller.updateItem);
router.delete('/:itemId', requireAuth, controller.deleteItem);

router.post('/:itemId/requests', requireAuth, controller.requestExchange);

module.exports = router;
