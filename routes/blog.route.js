const express = require("express");
const blogModel = require("../models/blog.model");

const blogsRoute = express.Router();

blogsRoute.get("/", async (req, res) => {
  const {
    author,
    title,
    tags,
    read_count,
    reading_time,
    time,
    page = 1,
    limit = 20,
  } = req.query;

  const state = "published";

  let readCountNum;
  let readTimeNum;
  let timeNum;

  read_count === "asc" ? (readCountNum = 1) : (readCountNum = -1);
  reading_time === "asc" ? (readTimeNum = 1) : (readTimeNum = -1);
  time === "asc" ? (timeNum = 1) : (timeNum = -1);

  try {
    let blogs;
    if (author) {
      blogs = await blogModel
        .find({ state, author })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    } else if (title) {
      blogs = await blogModel
        .find({ state, title })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    } else if (tags) {
      blogs = await blogModel
        .find({
          state,
          tags: {
            $in: [tags],
          },
        })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    } else if (read_count) {
      blogs = await blogModel
        .find({ state })
        .sort({
          read_count: readCountNum,
        })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    } else if (reading_time) {
      blogs = await blogModel
        .find({ state })
        .sort({
          reading_time: readTimeNum,
        })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    } else if (time) {
      blogs = await blogModel
        .find({ state })
        .sort({
          timestamps: timeNum,
        })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    } else {
      blogs = await blogModel
        .find({ state })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }
    res.status(200).json({ total_blogs: blogs.length, blogs });
  } catch (err) {
    res.status(500).json({ status: false, message: err });
  }
});

blogsRoute.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;

  await blogModel
    .findById(blogId)
    .then((blog) => {
      if (!blog) {
        return res.status(404).json({ status: false, blog: null });
      } else if (blog.state == "draft") {
        return res
          .status(404)
          .json({ status: false, message: "This blog is not yet published" });
      }

      blog.read_count++;

      blog.save();

      const { author, ...result } = blog;
      const blogResult = result._doc;
      return res.json({ status: true, witten_by: author, blogResult });
    })
    .catch((err) => {
      return res.status(404).json({ status: false, message: err });
    });
});

module.exports = blogsRoute;
