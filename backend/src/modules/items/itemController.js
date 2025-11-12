const itemService = require('./itemService');

async function listItems(req, res, next) {
  try {
    const data = await itemService.listItems(req.query || {});
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getItem(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);
    if (Number.isNaN(itemId)) {
      return res.status(400).json({ message: 'itemId ไม่ถูกต้อง' });
    }
    const item = await itemService.getItem(itemId);
    if (!item) {
      return res.status(404).json({ message: 'ไม่พบสินค้า' });
    }
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

async function createItem(req, res, next) {
  try {
    const item = await itemService.createItem(req.body || {}, req.userId);
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
}

async function updateItem(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);
    if (Number.isNaN(itemId)) {
      return res.status(400).json({ message: 'itemId ไม่ถูกต้อง' });
    }
    const item = await itemService.updateItem(itemId, req.userId, req.body || {});
    if (!item) {
      return res.status(404).json({ message: 'ไม่พบสินค้า หรือไม่มีสิทธิ์แก้ไข' });
    }
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

async function deleteItem(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);
    if (Number.isNaN(itemId)) {
      return res.status(400).json({ message: 'itemId ไม่ถูกต้อง' });
    }
    const success = await itemService.deleteItem(itemId, req.userId);
    if (!success) {
      return res.status(404).json({ message: 'ไม่พบสินค้า หรือไม่มีสิทธิ์ลบ' });
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

async function requestExchange(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);
    if (Number.isNaN(itemId)) {
      return res.status(400).json({ message: 'itemId ไม่ถูกต้อง' });
    }

    const message = req.body?.message || '';
    const offer = req.body?.offer || {};
    const notification = await itemService.createExchangeRequest({
      itemId,
      requesterId: req.userId,
      message,
      offer,
    });

    res.status(201).json({ notification });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  requestExchange,
};
