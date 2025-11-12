import * as ItemModel from './itemModel.js';

export const getAllItems = async (query) => {
  const result = await ItemModel.findAll(query);
  return {
    items: result.items,
    total: result.total,
    page: parseInt(query.page || 1, 10),
    totalPages: Math.ceil(result.total / (query.limit || 10)),
  };
};

export const getItemById = (id) => ItemModel.findById(id);
export const getCategories = () => ItemModel.findCategories();
export const getFeatured = (limit) => ItemModel.findFeatured(limit);
export const getRecommended = (user, limit) => ItemModel.findRecommended(user, limit);
export const createItem = (data, userId) => ItemModel.createItem(data, userId);
export const updateItem = (itemId, data, userId) => ItemModel.updateItem(itemId, data, userId);
export const deleteItem = (itemId, userId) => ItemModel.deleteItem(itemId, userId);
