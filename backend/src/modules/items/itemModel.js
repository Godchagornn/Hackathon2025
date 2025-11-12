const db = require('../../database/client');

const baseSelect = `
  SELECT
    i.id,
    i.user_id,
    i.title,
    i.description,
    i.category,
    i.condition,
    i.status,
    i.images,
    i.tags,
    i.created_at,
    i.updated_at,
    u.display_name AS owner_name,
    u.faculty AS owner_faculty,
    u.avatar_url AS owner_avatar
  FROM items i
  JOIN users u ON u.id = i.user_id
`;

function buildFilters({ search, category, ownerId, status }) {
  const clauses = [];
  const params = [];

  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    clauses.push(`LOWER(i.title) LIKE $${params.length}`);
  }

  if (category) {
    params.push(category);
    clauses.push(`i.category = $${params.length}`);
  }

  if (ownerId) {
    params.push(ownerId);
    clauses.push(`i.user_id = $${params.length}`);
  }

  if (status) {
    params.push(status);
    clauses.push(`i.status = $${params.length}`);
  }

  return { clauses, params };
}

async function listItems({ search, category, ownerId, status, limit, offset }) {
  const { clauses, params } = buildFilters({ search, category, ownerId, status });
  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

  const queryText = `
    ${baseSelect}
    ${whereSql}
    ORDER BY i.created_at DESC
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

  const countText = `
    SELECT COUNT(*) AS total
    FROM items i
    ${clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : ''}
  `;

  const limitVal = Number(limit) || 20;
  const offsetVal = Number(offset) || 0;

  const [itemsResult, countResult] = await Promise.all([
    db.query(queryText, [...params, limitVal, offsetVal]),
    db.query(countText, params),
  ]);

  return {
    items: itemsResult.rows,
    total: Number(countResult.rows[0].total),
  };
}

async function findItemById(itemId) {
  const { rows } = await db.query(
    `
    ${baseSelect}
    WHERE i.id = $1
    `,
    [itemId],
  );
  return rows[0] || null;
}

async function insertItem({
  userId,
  title,
  description,
  category,
  condition,
  status,
  images,
  tags,
}) {
  const { rows } = await db.query(
    `
    INSERT INTO items (
      user_id,
      title,
      description,
      category,
      condition,
      status,
      images,
      tags,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    RETURNING *
    `,
    [userId, title, description, category, condition, status, images, tags],
  );
  return rows[0];
}

async function updateItem(itemId, userId, updates) {
  const fields = [];
  const values = [];
  let idx = 1;

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = $${idx}`);
    values.push(value);
    idx += 1;
  });

  if (fields.length === 0) return null;

  const { rows } = await db.query(
    `
    UPDATE items
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${idx} AND user_id = $${idx + 1}
    RETURNING *
    `,
    [...values, itemId, userId],
  );
  return rows[0] || null;
}

async function deleteItem(itemId, userId) {
  const { rowCount } = await db.query(
    'DELETE FROM items WHERE id = $1 AND user_id = $2',
    [itemId, userId],
  );
  return rowCount > 0;
}

async function findItemOwner(itemId) {
  const { rows } = await db.query(
    `
    SELECT i.user_id, u.email, u.display_name
    FROM items i
    JOIN users u ON u.id = i.user_id
    WHERE i.id = $1
    `,
    [itemId],
  );
  return rows[0] || null;
}

module.exports = {
  listItems,
  findItemById,
  insertItem,
  updateItem,
  deleteItem,
  findItemOwner,
};
