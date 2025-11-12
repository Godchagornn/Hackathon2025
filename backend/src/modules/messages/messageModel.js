const db = require('../../database/client');

const baseConversationSelect = `
  SELECT
    c.id,
    c.item_id,
    c.user1_id,
    c.user2_id,
    c.last_message_at,
    c.created_at,
    i.title AS item_title,
    i.images AS item_images,
    CASE
      WHEN c.user1_id = $1 THEN c.user2_id
      ELSE c.user1_id
    END AS counterpart_id,
    opp.display_name AS counterpart_name,
    opp.faculty AS counterpart_faculty,
    opp.avatar_url AS counterpart_avatar,
    (
      SELECT row_to_json(msg)
      FROM (
        SELECT
          m.id,
          m.sender_id,
          m.text,
          m.attachments,
          m.is_read,
          m.created_at
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) msg
    ) AS last_message,
    (
      SELECT COUNT(*)
      FROM messages m
      WHERE
        m.conversation_id = c.id
        AND m.sender_id <> $1
        AND m.is_read = FALSE
    ) AS unread_count
  FROM conversations c
  LEFT JOIN items i ON i.id = c.item_id
  JOIN users opp ON opp.id = CASE WHEN c.user1_id = $1 THEN c.user2_id ELSE c.user1_id END
  WHERE c.user1_id = $1 OR c.user2_id = $1
`;

async function listConversations(userId) {
  const { rows } = await db.query(
    `
    ${baseConversationSelect}
    ORDER BY c.last_message_at DESC NULLS LAST, c.id DESC
    `,
    [userId],
  );
  return rows;
}

async function findConversationById(conversationId) {
  const { rows } = await db.query('SELECT * FROM conversations WHERE id = $1', [conversationId]);
  return rows[0] || null;
}

async function findConversationWithParticipants(userA, userB, itemId) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM conversations
    WHERE
      (
        (user1_id = $1 AND user2_id = $2)
        OR (user1_id = $2 AND user2_id = $1)
      )
      AND (item_id = $3 OR (item_id IS NULL AND $3 IS NULL))
    LIMIT 1
    `,
    [userA, userB, itemId || null],
  );
  return rows[0] || null;
}

async function createConversation({ itemId, userA, userB }) {
  const { rows } = await db.query(
    `
    INSERT INTO conversations (item_id, user1_id, user2_id, created_at, last_message_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING *
    `,
    [itemId || null, userA, userB],
  );
  return rows[0];
}

async function listMessages(conversationId, limit = 50, beforeDate = null) {
  const params = [conversationId];
  let whereClause = '';

  if (beforeDate) {
    params.push(beforeDate);
    whereClause = `AND created_at < $2`;
  }

  params.push(limit);

  const { rows } = await db.query(
    `
    SELECT id, conversation_id, sender_id, text, attachments, is_read, created_at
    FROM messages
    WHERE conversation_id = $1
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${params.length}
    `,
    params,
  );
  return rows;
}

async function insertMessage({ conversationId, senderId, text, attachments }) {
  const { rows } = await db.query(
    `
    INSERT INTO messages (conversation_id, sender_id, text, attachments, created_at, is_read)
    VALUES ($1, $2, $3, $4, NOW(), FALSE)
    RETURNING *
    `,
    [conversationId, senderId, text, attachments || []],
  );
  return rows[0];
}

async function touchConversation(conversationId) {
  await db.query(
    `UPDATE conversations SET last_message_at = NOW() WHERE id = $1`,
    [conversationId],
  );
}

async function markMessagesRead(conversationId, userId) {
  await db.query(
    `
    UPDATE messages
    SET is_read = TRUE
    WHERE conversation_id = $1 AND sender_id <> $2 AND is_read = FALSE
    `,
    [conversationId, userId],
  );
}

async function getConversationParticipants(conversationId) {
  const { rows } = await db.query(
    `
    SELECT
      c.id,
      c.user1_id,
      u1.email AS user1_email,
      u1.display_name AS user1_name,
      c.user2_id,
      u2.email AS user2_email,
      u2.display_name AS user2_name
    FROM conversations c
    JOIN users u1 ON u1.id = c.user1_id
    JOIN users u2 ON u2.id = c.user2_id
    WHERE c.id = $1
    `,
    [conversationId],
  );
  return rows[0] || null;
}

module.exports = {
  listConversations,
  listMessages,
  insertMessage,
  touchConversation,
  markMessagesRead,
  findConversationById,
  findConversationWithParticipants,
  createConversation,
  getConversationParticipants,
};
