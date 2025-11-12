import express from 'express';
import * as searchController from './searchController.js';

const router = express.Router();

// Search items with filters
router.get('/search', searchController.searchItems);

// Search suggestions
router.get('/search/suggestions', searchController.getSuggestions);

// Faculties filter
router.get('/filters/faculties', searchController.getFaculties);

export default router;
