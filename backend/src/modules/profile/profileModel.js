const db = require('../../database/client');

const profileFields = `
  id,
  email,
  display_name,
  faculty,
  bio,
  avatar_url,
  created_at,
  updated_at
`;

const itemFields = `
  id,
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
`;

async function findUserById(userId) {
  const { rows } = await db.query(
    `SELECT ${profileFields} FROM users WHERE id = $1`,
    [userId],
  );
  return rows[0] || null;
}

async function findItemsByUserId(userId) {
  const { rows } = await db.query(
    `SELECT ${itemFields}
     FROM items
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );
  return rows;
}

async function findExchangeHistoryByUserId(userId) {
  const { rows } = await db.query(
    `SELECT
        er.id,
        er.status,
        er.created_at,
        er.updated_at,
        er.requester_id,
        er.owner_id,
        er.item_id,
        er.offered_item_id,
        i.title AS item_title,
        oi.title AS offered_item_title
     FROM exchange_requests er
     JOIN items i ON i.id = er.item_id
     LEFT JOIN items oi ON oi.id = er.offered_item_id
     WHERE er.requester_id = $1 OR er.owner_id = $1
     ORDER BY er.created_at DESC
     LIMIT 25`,
    [userId],
  );
  return rows;
}

module.exports = {
  findUserById,
  findItemsByUserId,
  findExchangeHistoryByUserId,
};
