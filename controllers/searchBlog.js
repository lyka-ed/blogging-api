const express = require("express");
const blogModel = require("../models/blogs");

//Search the blogs for a certain tag or author etc.
async function searchBlogByTitle(req, res, next) {
  try {
    //This will get the search query param, whether search by author, title or tag.
    const title = req.query.title;
    const page = req.params.page;
    console.log(title);
    const blog = await blogModel.blog.find({ title: title });
    res.json({ blog, message: "Found Successfully" });
  } catch (err) {
    res.json({ err });
  }
}

async function searchBlogByAuthor(req, res, next) {
  try {
    //This will get the search query param, whether search by author, title or tag.
    const author = req.query.author;
    const page = req.params.page;
    // const blog = await blogModel.blog.find({"author": author})
    const blog = await blogModel.blog
      .find({ author: author })
      .skip((page - 1) * 20)
      .limit(20);
    console.log(author);
    console.log(blog);
    res.json({ blog, message: " Author Found Successfully" });
  } catch (err) {
    res.json({ err, message: "Author doesn not exist" });
  }
}

async function searchBlogByTags(req, res) {
  try {
    //This will get the search query param, whether search by author, title or tag.
    // const stringifyTag = JSON.stringify(req.query.tags);
    const tag = req.query.tag;
    const page = req.params.page;
    const limit = 20;

    const obj = JSON.parse(tag);

    console.log(obj);

    console.log(req.query);
    const blog = await blogModel.blog
      .find({ tags: { $all: obj } })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ blog, message: "Found blog by tag successfully!" });
  } catch (err) {
    res.json({ err });
  }
}

module.exports = { searchBlogByTitle, searchBlogByAuthor, searchBlogByTags };
