const db = require('../../database/client');

const notificationSelect = `
  SELECT
    er.id,
    er.message,
    er.status,
    er.created_at,
    er.updated_at,
    er.requester_id,
    er.owner_id,
    er.item_id,
    er.offered_item_id,
    requester.display_name AS requester_name,
    requester.email AS requester_email,
    requester.faculty AS requester_faculty,
    requester.avatar_url AS requester_avatar,
    owner.display_name AS owner_name,
    owner.email AS owner_email,
    owner.faculty AS owner_faculty,
    owner.avatar_url AS owner_avatar,
    target_item.title AS target_item_title,
    target_item.images AS target_item_images,
    target_item.category AS target_item_category,
    target_item.condition AS target_item_condition,
    offer_item.title AS offer_item_title,
    offer_item.images AS offer_item_images,
    offer_item.category AS offer_item_category,
    offer_item.condition AS offer_item_condition,
    ex.exchange_code,
    ex.verified_at,
    ex.completed_at,
    ex.created_at AS exchange_created_at
  FROM exchange_requests er
  JOIN users requester ON requester.id = er.requester_id
  JOIN users owner ON owner.id = er.owner_id
  JOIN items target_item ON target_item.id = er.item_id
  LEFT JOIN items offer_item ON offer_item.id = er.offered_item_id
  LEFT JOIN exchanges ex ON ex.request_id = er.id
`;

async function findNotificationsByUserId(userId) {
  const { rows } = await db.query(
    `
    ${notificationSelect}
    WHERE er.requester_id = $1 OR er.owner_id = $1
    ORDER BY er.created_at DESC
    `,
    [userId],
  );

  return rows;
}

async function findNotificationByIdForUser(userId, requestId) {
  const { rows } = await db.query(
    `
    ${notificationSelect}
    WHERE (er.requester_id = $1 OR er.owner_id = $1)
      AND er.id = $2
    `,
    [userId, requestId],
  );
  return rows[0] || null;
}

async function findRequestById(requestId) {
  const { rows } = await db.query(
    'SELECT * FROM exchange_requests WHERE id = $1',
    [requestId],
  );
  return rows[0] || null;
}

async function updateRequestStatus(requestId, status) {
  const { rows } = await db.query(
    `
    UPDATE exchange_requests
    SET status = $2,
        updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [requestId, status],
  );
  return rows[0] || null;
}

async function insertExchange(requestId, exchangeCode) {
  const { rows } = await db.query(
    `
    INSERT INTO exchanges (request_id, exchange_code, created_at, verified_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING *
    `,
    [requestId, exchangeCode],
  );
  return rows[0] || null;
}

async function updateExchange(requestId, exchangeCode) {
  const { rows } = await db.query(
    `
    UPDATE exchanges
    SET exchange_code = $2,
        verified_at = NOW(),
        completed_at = NULL
    WHERE request_id = $1
    RETURNING *
    `,
    [requestId, exchangeCode],
  );
  return rows[0] || null;
}

async function upsertExchange(requestId, exchangeCode) {
  const existing = await getExchangeByRequestId(requestId);
  if (existing) {
    return updateExchange(requestId, exchangeCode);
  }
  return insertExchange(requestId, exchangeCode);
}

async function deleteExchangeByRequestId(requestId) {
  await db.query(
    'DELETE FROM exchanges WHERE request_id = $1',
    [requestId],
  );
}

async function getExchangeByRequestId(requestId) {
  const { rows } = await db.query(
    'SELECT * FROM exchanges WHERE request_id = $1',
    [requestId],
  );
  return rows[0] || null;
}

async function markExchangeCompleted(requestId) {
  const { rows } = await db.query(
    `
    UPDATE exchanges
    SET completed_at = NOW()
    WHERE request_id = $1
    RETURNING *
    `,
    [requestId],
  );
  return rows[0] || null;
}

async function findItemById(itemId) {
  const { rows } = await db.query(
    `
    SELECT
      i.*,
      u.email AS owner_email,
      u.display_name AS owner_display_name
    FROM items i
    JOIN users u ON u.id = i.user_id
    WHERE i.id = $1
    `,
    [itemId],
  );
  return rows[0] || null;
}

async function createExchangeRequest({
  requesterId,
  ownerId,
  itemId,
  offeredItemId,
  message,
}) {
  const { rows } = await db.query(
    `
    INSERT INTO exchange_requests (
      requester_id,
      owner_id,
      item_id,
      offered_item_id,
      message,
      status,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, 'pending', NOW(), NOW())
    RETURNING *
    `,
    [requesterId, ownerId, itemId, offeredItemId, message],
  );

  return rows[0];
}

module.exports = {
  findNotificationsByUserId,
  findNotificationByIdForUser,
  findRequestById,
  updateRequestStatus,
  upsertExchange,
  deleteExchangeByRequestId,
  getExchangeByRequestId,
  markExchangeCompleted,
  findItemById,
  createExchangeRequest,
};
