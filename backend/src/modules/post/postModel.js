// src/modules/post/postModule.js
const postRoutes = require("./postRoute");

function initPostModule(app) {
  app.use("/api/posts", postRoutes);
}

module.exports = initPostModule;