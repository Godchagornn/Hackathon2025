const db = require('../../database/client');

async function findUserByEmail(email) {
  const { rows } = await db.query(
    `
    SELECT id, email, display_name, faculty, bio, avatar_url, password_hash
    FROM users
    WHERE email = $1
    `,
    [email],
  );
  return rows[0] || null;
}

async function upsertUser({ email, displayName, faculty, bio, avatarUrl, passwordHash }) {
  const { rows } = await db.query(
    `
    INSERT INTO users (email, display_name, faculty, bio, avatar_url, password_hash, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        faculty = COALESCE(EXCLUDED.faculty, users.faculty),
        bio = COALESCE(EXCLUDED.bio, users.bio),
        avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
        password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash),
        updated_at = NOW()
    RETURNING id, email, display_name, faculty, bio, avatar_url, password_hash
    `,
    [email, displayName, faculty, bio, avatarUrl, passwordHash],
  );

  return rows[0];
}

module.exports = {
  findUserByEmail,
  upsertUser,
};
