const express = require("express");
const createController = require("../controllers/createBlog");
const blogModel = require("../models/blogs");

const createBlogRoute = express.Router();

// User create the blog and  save to mongoDB
createBlogRoute.post("/create", createController.createBlog);
createBlogRoute.get("/blogs/:page", createController.getAllBlogs); // This  Return all blogs published.
createBlogRoute.put("/edit/:id", createController.editBlog); // Edit a blog

createBlogRoute.delete("/delete/:id", createController.deleteBlog);
createBlogRoute.get("/blog/:id", createController.getBlogById);

//Want to filter by state using this route.
createBlogRoute.get("/user/blogs/filter/:param", createController.filterState);

// createBlogRoute.get('/:state', createController.deleteBlog);
createBlogRoute.put("/:id/published", createController.updateState);
createBlogRoute.get("/user/blogs/:page", createController.getMyBlogs);

createBlogRoute.get(
  "/blogs/filter/readCount",
  createController.filterByReadCount
);

// /blogs/filter/
createBlogRoute.get(
  "/blogs/filter/readTime",
  createController.filterReadingTime
);

module.exports = { createBlogRoute };
