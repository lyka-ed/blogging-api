const express = require("express");
const blogModel = require("../models/blog.model");
const jwt = require("jsonwebtoken");

const authorBlogRoute = express.Router();
const { blogImages, fileSizeConverter } = require("../uploadFunction");

const readTimeFunction = (text) => {
  const wpm = 250;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
};

authorBlogRoute.post("/", blogImages.array("files", 10), async (req, res) => {
  const { secret_token } = req.query;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;

  let filesArray = [];
  req.files.forEach((element) => {
    const file = {
      fileName: element.originalname,
      fileType: element.mimetype,
      fileSize: fileSizeConverter(element.size, 2),
    };

    filesArray.push(file);
  });

  try {
    const body = req.body;
    const blogArticle = body.body;
    let reading_time;

    if (blogArticle) {
      reading_time = readTimeFunction(blogArticle);
    }

    const blogDetails = {
      title: body.title,
      description: body.description,
      tags: body.tags,
      author: blogAuthor,
      reading_time,
      body: blogArticle,
      files: filesArray,
    };

    await blogModel
      .create(blogDetails)
      .then((blog) => {
        return res.json({ status: true, blog }).status(201);
      })
      .catch((err) => {
        return res.json({ status: false, message: err }).status(403);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

authorBlogRoute.get("/", async (req, res) => {
  const { secret_token, page = 1, limit = 20 } = req.query;

  const state = req.body.state;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;

  try {
    let blogs;
    if (state) {
      blogs = await blogModel
        .find({ author: blogAuthor, state })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    } else {
      blogs = await blogModel
        .find({ author: blogAuthor })
        .limit(limit * 1)
        .skip((page - 1) * limit);
    }
    res.status(200).json({ total_blogs: blogs.length, blogs });
  } catch (err) {
    res.status(500).json({ status: false, message: err });
  }
});

authorBlogRoute.get("/:blogId", async (req, res) => {
  const { blogId } = req.params;

  const { secret_token } = req.query;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;

  await blogModel
    .findById(blogId)
    .then((blog) => {
      if (!blog) {
        return res.status(404).json({ status: false, blog: null });
      } else if (blogAuthor === blog.author) {
        const { author, ...result } = blog;
        const blogResult = result._doc;
        return res.json({ status: true, witten_by: author, blogResult });
      } else {
        return res.status(401).json({
          status: false,
          message: "you can only view blogs written by you",
        });
      }
    })
    .catch((err) => {
      return res.status(404).json({ status: false, message: err });
    });
});

authorBlogRoute.patch("/:id", async (req, res) => {
  const blogId = req.params.id;

  const { secret_token } = req.query;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;

  try {
    const blog = await blogModel.findById(blogId);
    if (blog.author === blogAuthor) {
      try {
        const updatedBlog = await blogModel.findByIdAndUpdate(
          blogId,
          {
            $set: req.body,
          },
          { new: true }
        );

        let updatedReadingTime = readTimeFunction(updatedBlog.body);

        updatedBlog.reading_time = updatedReadingTime;

        updatedBlog.save();

        res.status(200).json(updatedBlog);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your own post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

authorBlogRoute.put("/:id", async (req, res) => {
  const blogId = req.params.id;

  const { secret_token } = req.query;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;

  try {
    const blog = await blogModel.findById(blogId);
    if (blog.author === blogAuthor) {
      try {
        const updatedBlog = await blogModel.findByIdAndUpdate(
          blogId,
          {
            $set: req.body,
          },
          { new: true }
        );

        let updatedReadingTime = readTimeFunction(updatedBlog.body);

        updatedBlog.reading_time = updatedReadingTime;

        updatedBlog.save();

        res.status(200).json(updatedBlog);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your own post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

authorBlogRoute.delete("/:id", async (req, res) => {
  const blogId = req.params.id;

  const { secret_token } = req.query;

  const jwtDecoded = jwt.decode(secret_token);

  const blogAuthor = jwtDecoded.user.fullname;

  try {
    const blog = await blogModel.findById(blogId);
    if (blog.author === blogAuthor) {
      try {
        await blog.delete();
        res.status(200).json("Post successfully deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your own post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = authorBlogRoute;
