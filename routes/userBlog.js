const express = require("express");
const { getAllBlogs } = require("../controllers/blog.controller");
const { isAuthenticated } = require("../middleware/authsmiddleware");
const { wrapper } = require("../utils/appFeature");

const userRoute = express.Router();

userRoute.get("/me/blogs", isAuthenticated, wrapper(getAllBlogs));

module.exports = userRoute;
