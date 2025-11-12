const itemModel = require('./itemModel');
const notificationService = require('../notifications/notificationService');

function validateItemPayload(payload, { partial = false } = {}) {
  const errors = [];
  const fields = ['title', 'category', 'condition', 'status'];

  if (!partial || payload.title !== undefined) {
    if (!payload.title || typeof payload.title !== 'string' || payload.title.trim().length < 3) {
      errors.push('title ต้องมีอย่างน้อย 3 ตัวอักษร');
    }
  }

  if (!partial || payload.category !== undefined) {
    if (!payload.category || typeof payload.category !== 'string') {
      errors.push('category จำเป็น');
    }
  }

  if (!partial || payload.condition !== undefined) {
    if (payload.condition && !['new', 'good', 'fair', 'used'].includes(payload.condition)) {
      errors.push('condition ต้องเป็น new/good/fair/used');
    }
  }

  if (!partial || payload.status !== undefined) {
    if (payload.status && !['available', 'pending', 'exchanged', 'archived'].includes(payload.status)) {
      errors.push('status ไม่ถูกต้อง');
    }
  }

  if (payload.images && !Array.isArray(payload.images)) {
    errors.push('images ต้องเป็น array');
  }

  if (payload.tags && !Array.isArray(payload.tags)) {
    errors.push('tags ต้องเป็น array');
  }

  if (errors.length > 0) {
    const err = new Error('Validation failed');
    err.statusCode = 400;
    err.details = errors;
    throw err;
  }
}

function mapItem(itemRow) {
  if (!itemRow) return null;
  return {
    id: itemRow.id,
    ownerId: itemRow.user_id,
    title: itemRow.title,
    description: itemRow.description,
    category: itemRow.category,
    condition: itemRow.condition,
    status: itemRow.status,
    images: itemRow.images || [],
    tags: itemRow.tags || [],
    createdAt: itemRow.created_at,
    updatedAt: itemRow.updated_at,
    owner: {
      name: itemRow.owner_name,
      faculty: itemRow.owner_faculty,
      avatar: itemRow.owner_avatar,
    },
  };
}

async function listItems(filters) {
  const limit = Math.min(Number(filters.limit) || 12, 50);
  const offset = ((Number(filters.page) || 1) - 1) * limit;
  const search = filters.search ? filters.search.trim() : undefined;
  const status = filters.status === 'all' ? undefined : filters.status;

  const result = await itemModel.listItems({
    search,
    category: filters.category,
    ownerId: filters.ownerId,
    status,
    limit,
    offset,
  });

  return {
    items: result.items.map(mapItem),
    pagination: {
      total: result.total,
      page: Number(filters.page) || 1,
      pageSize: limit,
      totalPages: Math.ceil(result.total / limit),
    },
  };
}

async function getItem(itemId) {
  const item = await itemModel.findItemById(itemId);
  return mapItem(item);
}

async function createItem(payload, ownerId) {
  validateItemPayload(payload);
  const newItem = await itemModel.insertItem({
    userId: ownerId,
    title: payload.title.trim(),
    description: payload.description || null,
    category: payload.category.trim(),
    condition: payload.condition || 'good',
    status: payload.status || 'available',
    images: payload.images || [],
    tags: payload.tags || [],
  });
  const withOwner = await itemModel.findItemById(newItem.id);
  return mapItem(withOwner);
}

async function updateItem(itemId, ownerId, payload) {
  validateItemPayload(payload, { partial: true });
  const updates = {};
  ['title', 'description', 'category', 'condition', 'status'].forEach((field) => {
    if (payload[field] !== undefined) {
      updates[field] =
        typeof payload[field] === 'string' ? payload[field].trim() : payload[field];
    }
  });
  if (payload.images !== undefined) updates.images = payload.images;
  if (payload.tags !== undefined) updates.tags = payload.tags;

  const updated = await itemModel.updateItem(itemId, ownerId, updates);
  if (!updated) return null;
  const withOwner = await itemModel.findItemById(itemId);
  return mapItem(withOwner);
}

async function deleteItem(itemId, ownerId) {
  return itemModel.deleteItem(itemId, ownerId);
}

async function createExchangeRequest({ itemId, requesterId, message, offer }) {
  const owner = await itemModel.findItemOwner(itemId);
  if (!owner) {
    const error = new Error('ไม่พบสินค้า');
    error.statusCode = 404;
    throw error;
  }

  if (owner.user_id === requesterId) {
    const error = new Error('ไม่สามารถขอแลกสินค้าตัวเองได้');
    error.statusCode = 400;
    throw error;
  }

  const request = await notificationService.createExchangeRequestNotification({
    ownerId: owner.user_id,
    requesterId,
    itemId,
    message,
    offer,
  });

  return request;
}

module.exports = {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  createExchangeRequest,
};
