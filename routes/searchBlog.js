const express = require("express");
const searchController = require("../controllers/searchBlog");

const searchRouter = express.Router();

//Search route by title, author or by tags
searchRouter.get("/blog/:page/bytitle", searchController.searchBlogByTitle);
searchRouter.get("/blog/:page/byauthor", searchController.searchBlogByAuthor);
searchRouter.get("/blog/:page/bytag", searchController.searchBlogByTags);

module.exports = { searchRouter };
