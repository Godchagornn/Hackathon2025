import pool from '../../database/config.js';

// ดึงข้อมูลทั้งหมด
export const findAll = async ({ page = 1, limit = 10, category, faculty }) => {
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM items WHERE "isActive" = true';
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }

  if (faculty) {
    params.push(faculty);
    query += ` AND faculty = $${params.length}`;
  }

  query += ` ORDER BY "createdAt" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const { rows } = await pool.query(query, params);
  const totalRes = await pool.query('SELECT COUNT(*) FROM items WHERE "isActive" = true');
  const total = parseInt(totalRes.rows[0].count, 10);

  return { items: rows, total };
};

// ดึง item ตาม id
export const findById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
  return rows[0];
};

// ดึงข้อมูลหมวดหมู่ทั้งหมด
export const findCategories = async () => {
  const { rows } = await pool.query('SELECT DISTINCT category FROM items WHERE category IS NOT NULL');
  return rows.map((r) => ({ name: r.category }));
};

// ดึงรายการเด่น (featured)
export const findFeatured = async (limit = 6) => {
  const { rows } = await pool.query(
    'SELECT * FROM items WHERE "isActive" = true ORDER BY "createdAt" DESC LIMIT $1',
    [limit]
  );
  return rows;
};

// ดึงรายการแนะนำ (recommended)
export const findRecommended = async (user, limit = 10) => {
  if (!user) return [];
  const params = [user.id, limit];
  let query = `SELECT * FROM items WHERE "isActive" = true AND "ownerId" != $1`;
  if (user.faculty) {
    params.splice(1, 0, user.faculty);
    query += ` AND faculty = $2 ORDER BY "createdAt" DESC LIMIT $3`;
  } else {
    query += ` ORDER BY "createdAt" DESC LIMIT $2`;
  }

  const { rows } = await pool.query(query, params);
  return rows;
};

// เพิ่มข้อมูลใหม่
export const createItem = async (data, ownerId) => {
  const {
    title,
    description,
    category,
    condition,
    faculty,
    tags = [],
    images = [],
  } = data;

  const query = `
    INSERT INTO items (title, description, category, condition, faculty, tags, images, "ownerId", "isActive", "createdAt", "updatedAt")
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true, NOW(), NOW())
    RETURNING *;
  `;
  const params = [title, description, category, condition, faculty, tags, images, ownerId];
  const { rows } = await pool.query(query, params);
  return rows[0];
};

// อัปเดตข้อมูล
export const updateItem = async (itemId, data, ownerId) => {
  const fields = [];
  const params = [];
  let i = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`"${key}" = $${i++}`);
    params.push(value);
  }

  params.push(itemId, ownerId);
  const query = `
    UPDATE items SET ${fields.join(', ')}, "updatedAt" = NOW()
    WHERE id = $${i++} AND "ownerId" = $${i}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, params);
  return rows[0];
};

// ลบข้อมูล
export const deleteItem = async (itemId, ownerId) => {
  const { rowCount } = await pool.query('DELETE FROM items WHERE id = $1 AND "ownerId" = $2', [
    itemId,
    ownerId,
  ]);
  return rowCount > 0;
};
