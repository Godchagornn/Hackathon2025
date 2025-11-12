const Item = require('../../items/itemModel');
const { Op } = require('sequelize');

// Search items with filters
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

    const where = { isActive: true };

    // Search in title and description
    if (q.trim()) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q.trim()}%` } },
        { description: { [Op.iLike]: `%${q.trim()}%` } },
      ];
    }

    if (category) where.category = category;
    if (faculty) where.faculty = faculty;
    if (condition) where.condition = condition;

    // Sorting
    let order = [['createdAt', 'DESC']];
    if (sort === 'oldest') order = [['createdAt', 'ASC']];
    if (sort === 'popular') order = [['views', 'DESC']]; // optional, if you have views column

    const { count, rows } = await Item.findAndCountAll({
      where,
      order,
      offset: (page - 1) * limit,
      limit: parseInt(limit, 10),
    });

    // Filters options to return
    const filters = {
      categories: await Item.findAll({
        attributes: ['category'],
        group: ['category'],
        raw: true,
      }),
      faculties: await Item.findAll({
        attributes: ['faculty'],
        group: ['faculty'],
        raw: true,
      }),
      conditions: ['new', 'used'],
    };

    return {
      items: rows,
      total: count,
      page: parseInt(page, 10),
      totalPages: Math.ceil(count / limit),
      filters,
    };
  } catch (err) {
    throw err;
  }
};

// Search suggestions by title
exports.getSuggestions = async (q) => {
  try {
    if (!q.trim()) return [];

    const items = await Item.findAll({
      where: { isActive: true, title: { [Op.iLike]: `%${q.trim()}%` } },
      attributes: ['title'],
      limit: 5,
    });

    return items.map((i) => i.title);
  } catch (err) {
    throw err;
  }
};

// Get list of faculties for filter
exports.getFaculties = async () => {
  try {
    const facultiesRaw = await Item.findAll({
      attributes: ['faculty'],
      where: { faculty: { [Op.ne]: null } },
      group: ['faculty'],
      raw: true,
    });

    return facultiesRaw.map((f) => ({ name: f.faculty })).filter(Boolean);
  } catch (err) {
    throw err;
  }
};
