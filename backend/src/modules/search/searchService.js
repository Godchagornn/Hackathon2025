import pool from '../../database/config.js';

// ========================
// Search items with filters
// ========================
export const searchItems = async (query) => {
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

    let baseQuery = 'FROM items WHERE "isActive" = true';
    const params = [];
    let i = 1;

    if (q.trim()) {
      baseQuery += ` AND (LOWER(title) LIKE LOWER($${i}) OR LOWER(description) LIKE LOWER($${i}))`;
      params.push(`%${q.trim()}%`);
      i++;
    }

    if (category) {
      baseQuery += ` AND category = $${i}`;
      params.push(category);
      i++;
    }

    if (faculty) {
      baseQuery += ` AND faculty = $${i}`;
      params.push(faculty);
      i++;
    }

    if (condition) {
      baseQuery += ` AND condition = $${i}`;
      params.push(condition);
      i++;
    }

    // Sorting
    let orderBy = 'ORDER BY "createdAt" DESC';
    if (sort === 'oldest') orderBy = 'ORDER BY "createdAt" ASC';
    if (sort === 'popular') orderBy = 'ORDER BY views DESC'; // optional column

    const offset = (page - 1) * limit;
    const itemsQuery = `
      SELECT * ${baseQuery}
      ${orderBy}
      LIMIT $${i++} OFFSET $${i}
    `;
    params.push(limit, offset);

    const totalQuery = `SELECT COUNT(*) ${baseQuery}`;
    const [itemsRes, totalRes] = await Promise.all([
      pool.query(itemsQuery, params),
      pool.query(totalQuery, params.slice(0, params.length - 2)),
    ]);

    // Filters options
    const filters = await getFilters();

    return {
      items: itemsRes.rows,
      total: parseInt(totalRes.rows[0].count, 10),
      page: parseInt(page, 10),
      totalPages: Math.ceil(totalRes.rows[0].count / limit),
      filters,
    };
  } catch (err) {
    throw err;
  }
};

// ========================
// Suggestions
// ========================
export const getSuggestions = async (q) => {
  if (!q.trim()) return [];

  const { rows } = await pool.query(
    'SELECT title FROM items WHERE "isActive" = true AND LOWER(title) LIKE LOWER($1) LIMIT 5',
    [`%${q.trim()}%`]
  );

  return rows.map((r) => r.title);
};

// ========================
// Faculties
// ========================
export const getFaculties = async () => {
  const { rows } = await pool.query(
    'SELECT DISTINCT faculty FROM items WHERE faculty IS NOT NULL'
  );
  return rows.map((r) => ({ name: r.faculty })).filter(Boolean);
};

// ========================
// Filters helper
// ========================
const getFilters = async () => {
  const [categoriesRes, facultiesRes] = await Promise.all([
    pool.query('SELECT DISTINCT category FROM items WHERE category IS NOT NULL'),
    pool.query('SELECT DISTINCT faculty FROM items WHERE faculty IS NOT NULL'),
  ]);

  return {
    categories: categoriesRes.rows.map((r) => ({ name: r.category })),
    faculties: facultiesRes.rows.map((r) => ({ name: r.faculty })),
    conditions: ['new', 'used'],
  };
};
