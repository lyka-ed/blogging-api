const express = require("express");
const blogController = require("../controllers/blog.controller.js");
const { isAuthenticated } = require("../middleware/authsmiddleware.js");
const { wrapper } = require("../utils/appFeature.js");

const blogRouter = express.Router();

blogRouter.get("/posts", wrapper(blogController.getAllPublishedBlogs));
blogRouter.get("/:id", wrapper(blogController.getBlog));
blogRouter.post("/", isAuthenticated, wrapper(blogController.createBlog));
blogRouter.patch("/:id", isAuthenticated, wrapper(blogController.updateBlog));
blogRouter.patch(
  "/:id/publish",
  isAuthenticated,
  wrapper(blogController.publishBlog)
);
blogRouter.delete("/:id", isAuthenticated, wrapper(blogController.deleteBlog));

module.exports = blogRouter;
