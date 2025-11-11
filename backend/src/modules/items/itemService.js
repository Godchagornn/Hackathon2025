const Item = require('../itemModel');
const { Op } = require('sequelize');

// Validation helper
const validateItemData = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string');
    }
  }

  if (!isUpdate || data.category !== undefined) {
    if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
      errors.push('Category is required and must be a non-empty string');
    }
  }

  if (!isUpdate || data.condition !== undefined) {
    if (data.condition && !['new', 'used'].includes(data.condition)) {
      errors.push('Condition must be either "new" or "used"');
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (data.description && typeof data.description !== 'string') {
      errors.push('Description must be a string');
    }
  }

  if (!isUpdate || data.faculty !== undefined) {
    if (data.faculty && typeof data.faculty !== 'string') {
      errors.push('Faculty must be a string');
    }
  }

  if (!isUpdate || data.tags !== undefined) {
    if (data.tags && !Array.isArray(data.tags)) {
      errors.push('Tags must be an array');
    }
  }

  if (!isUpdate || data.images !== undefined) {
    if (data.images && !Array.isArray(data.images)) {
      errors.push('Images must be an array');
    }
  }

  if (errors.length > 0) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }
};

exports.getAllItems = async (query) => {
  try {
    const { page = 1, limit = 10, category, faculty } = query;

    const where = { isActive: true };
    if (category) where.category = category;
    if (faculty) where.faculty = faculty;

    const { count, rows } = await Item.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });

    return {
      items: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    throw err;
  }
};

exports.getItemById = async (itemId) => {
  try {
    return await Item.findByPk(itemId);
  } catch (err) {
    throw err;
  }
};

exports.createItem = async (data, userId) => {
  try {
    // Validate input
    validateItemData(data);

    return await Item.create({
      ...data,
      ownerId: userId,
      title: data.title.trim(),
      category: data.category.trim(),
    });
  } catch (err) {
    throw err;
  }
};

exports.updateItem = async (itemId, data, userId) => {
  try {
    const item = await Item.findOne({ where: { id: itemId, ownerId: userId } });
    if (!item) return null;

    // Validate input (for update, only validate fields that are being updated)
    validateItemData(data, true);

    await item.update({
      ...data,
      title: data.title ? data.title.trim() : item.title,
      category: data.category ? data.category.trim() : item.category,
    });
    return item;
  } catch (err) {
    throw err;
  }
};

exports.deleteItem = async (itemId, userId) => {
  try {
    const result = await Item.destroy({ where: { id: itemId, ownerId: userId } });
    return result > 0;
  } catch (err) {
    throw err;
  }
};