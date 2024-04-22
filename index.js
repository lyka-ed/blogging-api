const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const bodyParser = require("body-parser");
const AuthenticationRoute = require("./src/routes/authentication.route");

const app = express();
dotenv.config();

require("./src/controllers/authentication.controller");

const authorBlogRoute = require("./src/routes/authorblog.route");
const blogsRoute = require("./src/routes/blogs.route");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", AuthenticationRoute);
app.use(
  "/authorblog",
  passport.authenticate("jwt", { session: false }),
  authorBlogRoute
);
app.use("/blog", blogsRoute);

app.get("/", (req, res) => {
  res.json({
    status: true,
    i: "Key information about this API.",
    ii: "use /blog to view all published blogs",
    iii: "Login or signup (using /login or /signup) to be able create and manage your blog as an author on /authorblog route.",
  });
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
