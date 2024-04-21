const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { request } = require("express");

const Schema = mongoose.Schema;

const blogModel = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    // ref: "users"
  },
  authorID: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  tags: {
    type: Array,
  },
  state: {
    type: String,
    required: true,
    default: "draft",
  },
  readingTime: {
    type: String,
    default: "NaN",
  },
  read_count: {
    type: Number,
    default: 0,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

// Reading Time
blogModel.pre("save", async function (next) {
  try {
    const blog = this;
    const body = this.body;

    const wordsCount = body.split(" ").length; //To get the wordCount of the blog.
    const definedWPM = 200;

    const readingTime =
      Math.round(wordsCount / definedWPM).toString() + " minutes";

    this.readingTime = readingTime;
  } catch (err) {
    res.json({ err });
  }
});

blogModel.method.ReadCount = async function () {
  blog.read_count += 1;
  blogModel.blog.save();
};

const blog = mongoose.model("blog", blogModel);

module.exports = { blog };
