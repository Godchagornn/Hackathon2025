// src/modules/post/postService.js
const pool = require("../../db");

const postService = {
  async getAllPosts() {
    const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
    return result.rows;
  },

  async getPostById(id) {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    return result.rows[0];
  },

  async createPost(data) {
    const { user_id, title, content, images, tags } = data;
    const result = await pool.query(
      `INSERT INTO posts (user_id, title, content, images, tags)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, title, content, images || [], tags || []]
    );
    return result.rows[0];
  },

  async updatePost(id, data) {
    const { title, content, images, tags } = data;
    const result = await pool.query(
      `UPDATE posts
       SET title = $1, content = $2, images = $3, tags = $4, updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [title, content, images || [], tags || [], id]
    );
    return result.rows[0];
  },

  async deletePost(id) {
    const result = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  },
};

module.exports = postService;