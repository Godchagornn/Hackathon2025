const Item = require('../../items/itemModel');
const { Op } = require('sequelize');

exports.searchItems = async (query) => {
  try {
    const {
      q = '',
      category,
      faculty,
      condition,
      sort = 'newest',
      page = 1,
      limit = 10,
    } = query;

    const where = {
      isActive: true,
    };

    // ค้นหา title และ description
    if (q && q.trim()) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q.trim()}%` } },
        { description: { [Op.iLike]: `%${q.trim()}%` } },
      ];
    }

    if (category) where.category = category;
    if (faculty) where.faculty = faculty;
    if (condition) where.condition = condition;

    let order = [['createdAt', 'DESC']];
    if (sort === 'oldest') order = [['createdAt', 'ASC']];

    const { count, rows } = await Item.findAndCountAll({
      where,
      order,
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

exports.getSuggestions = async (q) => {
  try {
    if (!q || q.trim().length === 0) {
      return [];
    }

    const items = await Item.findAll({
      where: {
        isActive: true,
        title: { [Op.iLike]: `%${q.trim()}%` }
      },
      attributes: ['title'],
      limit: 5,
    });

    return items.map((i) => i.title);
  } catch (err) {
    throw err;
  }
};