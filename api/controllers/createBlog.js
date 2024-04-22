const blogModel = require("../models/blogs");
const userModel = require("../models/users");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const logger = require("../logger");

dotenv.config();

async function createBlog(req, res, next) {
  const blogInfo = req.body;

  try {
    //This ties in the blog created by a user with an ID with a particular blog or blogs.
    const secret_token = await req.query.secret_token;
    const decodedJWT = await jwt.verify(secret_token, process.env.JWT_Secret);
    console.log(decodedJWT.user);

    const firstName = decodedJWT.user.firstName;
    const lastName = decodedJWT.user.lastName;
    const authorName = firstName + " " + lastName;

    const blog = await blogModel.blog.create({
      ...blogInfo,
      ...{ author: authorName },
      ...{ authorID: decodedJWT.user._id },
    });

    //Add the blog to the user's list of their blogs.
    let TheUser = await userModel.users.findOne({ _id: decodedJWT.user._id });

    TheUser.blogs.push(blog);
    await TheUser.save();
    //    const user = await foundUser.findByIdAndUpdate({ _id: decodedJWT.user._id }, { $push: {blogs: blog} });
    // const user = await userModel.updateOne({blogs}, )
    // await userModel.save();
    logger.info("Blog Created Successfully!");
    res.json({ message: "Blog Created Successfuly!" });
  } catch (error) {
    logger.error("Error creating blog:", error);
    next(error);
  }
}

//This function allows everyone whether logged in or not to get all Blogs published.
async function getAllBlogs(req, res, next) {
  try {
    const page = req.params.page;

    //Pagination --> 20 blogs per page.
    const limit = 20;
    const skip = (page - 1) * limit;
    const blogs = await blogModel.blog.find().skip(skip).limit(limit);

    logger.info("Retrieved all blogs successfully!");
    res.json({ blogs, message: "Gotten All Blogs Successfully!" });
  } catch (error) {
    logger.error("Error retrieving blogs:", error);
    next(error);
  }
}

async function editBlog(req, res, next) {
  const blogId = req.params.id;
  // const changeState = req.params.state;
  const newText = req.body; // The text or object to update the object to.

  try {
    const update = await blogModel.blog.findByIdAndUpdate(blogId, newText);
    logger.info("Blog updated successfully!"); // Log informational message
    res.status(200).send(update);
  } catch (error) {
    logger.error("Error updating blog:", error); // Log error
    res.status(500).send(error);
  }
}

async function deleteBlog(req, res, next) {
  const blogId = req.params.id;
  blogModel.blog.findByIdAndRemove(blogId, (err, done) => {
    if (err) {
      logger.error("Error deleting blog:", err);
      res.status().send(err);
    }

    logger.info("Blog deleted successfully!");
    res.json({ done, message: "Blog Deleted Successfully!" });
  });
}

async function updateState(req, res) {
  // /:id/published
  const blogId = req.params.id;
  const newState = { state: "published" };

  const update = await blogModel.blog
    .findByIdAndUpdate({ _id: blogId }, newState, { new: true })
    .then((newText) => {
      logger.info("Blog state updated successfully!");
      res.json({ message: "Successfully Updated" });
    })
    .catch((err) => {
      console.log(err);
      logger.error("Error updating blog state:", error);
      res.status(500).send(err);
    });
}

//For the logged in users to get all their blogs.
async function getMyBlogs(req, res, next) {
  try {
    //   /user/blog/page
    const secret_token = await req.query.secret_token;
    const decodedJWT = await jwt.verify(secret_token, process.env.JWT_Secret);
    const page = req.params.page;
    const id = decodedJWT.user._id;
    const limit = 20;
    const skip = (page - 1) * limit;

    //Find user with a particular ID and fetch all their blogs.
    const myBlogs = await userModel.users
      .findOne({ _id: id })
      .skip(skip)
      .limit(limit);
    const allBlogs = myBlogs.blogs;
    res.json({ allBlogs, message: "Fetched all blogs successfully!" });
  } catch (error) {
    next(error);
  }
}

async function getBlogById(req, res, next) {
  const id = req.query.id;
  const findBlog = await blogModel.blog.findOneAndUpdate(
    { _id: id },
    { $inc: { read_count: +1 } }
  );
  res.json({ findBlog, message: "Found Blog!" });
}
// /blog/:id

async function filterByReadCount(req, res, next) {
  const filterNum = req.query.num;

  try {
    const page = req.query.page;

    //Pagination --> 20 blogs per page.
    const limit = 20;
    const skip = (page - 1) * limit;
    const myBlogs = await blogModel.blog
      .find({ read_count: { $gte: filterNum } })
      .skip(skip)
      .limit(limit);

    res.json({ myBlogs, message: "Filter by read Count successful" });
  } catch (err) {
    res.json({ err }, { message: "Use a different filter readcount number" });
  }
}
async function filterState(req, res, next) {
  // /user/blogs/:param  if(param) { == draft}
  try {
    const param = req.params.param;
    const page = req.query.page;
    //Pagination --> 20 blogs per page.
    const limit = 20;
    const skip = (page - 1) * limit;

    const myBlogs = await blogModel.blog
      .find({ state: param })
      .skip(skip)
      .limit(limit);

    res.json({ myBlogs, message: "Filter by state successful" });
  } catch (err) {
    res.json(
      { err },
      { message: "State can only be either 'published' or 'draft'" }
    );
  }
}

async function filterReadingTime(req, res, next) {
  //blogs/filter/readTime  if(param) { == draft}
  const readTime = req.query.readTime;
  try {
    // const param = req.params.param;
    const page = req.query.page;
    //Pagination --> 20 blogs per page.
    const limit = 20;
    const skip = (page - 1) * limit;

    const myBlogs = await blogModel.blog
      .find({ reading_time: { $gt: readTime } })
      .skip(skip)
      .limit(limit);
    res.json({ myBlogs, message: "Filter by reading time successful" });
  } catch (err) {
    res.json({ err }, { message: "No data, change filter" });
  }
}

module.exports = {
  createBlog,
  getAllBlogs,
  editBlog,
  deleteBlog,
  updateState,
  getMyBlogs,
  filterState,
  getBlogById,
  filterByReadCount,
  filterReadingTime,
};
