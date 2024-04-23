const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const bodyParser = require("body-parser");
const AuthenticationRoute = require("./routes/authentication.route");
const authorBlogRoute = require("./routes/authorblog.route");
const blogsRoute = require("./routes/blog.route");

const app = express();
dotenv.config();

require("./controllers/authentication.controller");

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

module.exports = app; //for testing & app.js
