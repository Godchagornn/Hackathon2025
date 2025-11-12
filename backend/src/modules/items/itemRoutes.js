import express from 'express';
import * as itemController from './itemController.js';

const router = express.Router();

router.get('/', itemController.getItems);
router.get('/featured', itemController.getFeatured);
router.get('/recommended', itemController.getRecommended);
router.get('/categories', itemController.getCategories);
router.get('/:itemId', itemController.getItemById);

export default router;
