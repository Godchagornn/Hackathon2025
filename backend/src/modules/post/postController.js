// src/modules/post/postController.js
const postService = require("./postService");

const postController = {
  async getAll(req, res) {
    try {
      const posts = await postService.getAllPosts();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const post = await postService.getPostById(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const newPost = await postService.createPost(req.body);
      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await postService.updatePost(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Post not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await postService.deletePost(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Post not found" });
      res.json({ message: "Post deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = postController;