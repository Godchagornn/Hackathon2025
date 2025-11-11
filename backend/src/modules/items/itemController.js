const itemService = require('../itemService');

exports.getItems = async (req, res, next) => {
  try {
    const result = await itemService.getAllItems(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getItemById = async (req, res, next) => {
  try {
    const item = await itemService.getItemById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ item });
  } catch (err) {
    next(err);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const item = await itemService.createItem(req.body, req.user.id);
    res.status(201).json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const item = await itemService.updateItem(req.params.itemId, req.body, req.user.id);
    if (!item) return res.status(404).json({ message: 'Item not found or unauthorized' });
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const success = await itemService.deleteItem(req.params.itemId, req.user.id);
    if (!success) return res.status(404).json({ message: 'Item not found or unauthorized' });
    res.json({ success });
  } catch (err) {
    next(err);
  }
};