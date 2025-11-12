// src/modules/post/postRoute.js
const express = require("express");
const router = express.Router();
const postController = require("./postController");

// CRUD routes
router.get("/", postController.getAll);
router.get("/:id", postController.getById);
router.post("/", postController.create);
router.put("/:id", postController.update);
router.delete("/:id", postController.remove);

module.exports = router;
