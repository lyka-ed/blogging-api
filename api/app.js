const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const bodyParser = require("body-parser");
const connectToMongoDB = require("./db");
const authRoute = require("./routes/auth");
const createRoute = require("./routes/createBlog");

dotenv.config();
connectToMongoDB(); // Connect to MongoDB

require("./authentication/auth"); // Signup and login authentication middleware
const searchRoute = require("./routes/searchBlog");
const { create } = require("./models/users");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", authRoute); // app.use('/', createRoute.createBlogRoute), This didn't work so I decided to define each route in particular

app.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createRoute.createBlogRoute
);

app.get("/blogs/:page", createRoute.createBlogRoute);
app.get("/user/blogs/:page", createRoute.createBlogRoute); //
app.get("/user/blogs/filter/:param", createRoute.createBlogRoute);
app.get("/blog/:id", createRoute.createBlogRoute);

// app.put('/:id/:state', passport.authenticate('jwt', { session: false }),createRoute.createBlogRoute);

//Update  blog
app.put(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  createRoute.createBlogRoute
);

// Change state to published
app.put(
  "/:id/published",
  passport.authenticate("jwt", { session: false }),
  createRoute.createBlogRoute
);

// Delete blog
app.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  createRoute.createBlogRoute
);

app.get("/blogs/filter/readCount", createRoute.createBlogRoute);
app.get("/blogs/filter/readTime", createRoute.createBlogRoute);
app.get("/blog/:page/byauthor", searchRoute.searchRouter);
app.get("/blog/:page/bytitle", searchRoute.searchRouter);
app.get("/blog/:page/bytag", searchRoute.searchRouter);

// Render  Home page
app.get("/", (req, res) => {
  res.send("welcome to my Blog API!");
});

// Handle Error
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = { app };
