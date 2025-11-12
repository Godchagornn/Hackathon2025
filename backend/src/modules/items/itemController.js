const itemService = require('../itemService');

// GET /api/items
exports.getItems = async (req, res, next) => {
  try {
    const result = await itemService.getAllItems(req.query);
    res.json(result); // { items, total, page, totalPages }
  } catch (err) {
    next(err);
  }
};

// GET /api/items/featured
exports.getFeatured = async (req, res, next) => {
  try {
    const limit = req.query.limit || 6;
    const items = await itemService.getFeatured(limit);
    res.json(items); // { items: [] }
  } catch (err) {
    next(err);
  }
};

// GET /api/items/recommended
exports.getRecommended = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const items = await itemService.getRecommended(req.user, limit);
    res.json(items); // { items: [] }
  } catch (err) {
    next(err);
  }
};

// GET /api/items/:itemId
exports.getItemById = async (req, res, next) => {
  try {
    const item = await itemService.getItemById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ item });
  } catch (err) {
    next(err);
  }
};

// GET /api/items/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await itemService.getCategories();
    res.json(categories); // { categories: [] }
  } catch (err) {
    next(err);
  }
};