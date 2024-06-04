const express = require("express");
require("express-async-errors");
// const dotenv = require("dotenv");
const userRoute = require("./routes/userBlog.js");
const blogRouter = require("./routes/blog.route.js");
const authRoute = require("./routes/authentication.route.js");
const logger = require("./utils/logger.js");
const { requestLogger } = require("./middleware/requestlog.js");
const error = require("winston");
const { errorHandler } = require("./middleware/errorhandler.js");

const app = express();

// parse thenrequest body
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(errorHandler);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRoute);

app.all("*", (req, res) => {
  logger.error("Error", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    status: res.status,
    user: req.user ? req.user.id : "Guest",
  });
  res.status(404).json({
    success: "false",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app; //for testing & app.js
