const mongoose = require("mongoose");
const { getReadingTime } = require("../utils/appFeature");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog is required"],
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    state: {
      type: String,
      required: true,
      enum: ["draft", "published"],
      default: "draft",
    },

    read_count: {
      type: Number,
      default: 0,
    },

    reading_time: {
      type: Number,
      default: 0,
    },

    body: {
      type: String,
      required: [true, "Bodey is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, blog) {
        delete blog.__v;
      },
    },
  }
);

// Reading time  calculation before saving document
BlogSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function (next) {
  if (this.body) {
    this.reading_time = getReadingTime(this.body);
  }
  next();
});

// Text index setup to optimize search
BlogSchema.index({ title: "text", description: "text", tags: "text" });

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = { Blog };
