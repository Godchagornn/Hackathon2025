import * as itemService from './itemService.js';

export const getItems = async (req, res, next) => {
  try {
    const result = await itemService.getAllItems(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const limit = req.query.limit || 6;
    const items = await itemService.getFeatured(limit);
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

export const getRecommended = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const items = await itemService.getRecommended(req.user, limit);
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await itemService.getItemById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ item });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await itemService.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
