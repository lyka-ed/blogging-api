const { validate } = require("../utils/appFeature");
const {
  createBlogService,
  updateBlogService,
  deleteBlogService,
  publishBlogService,
  getBlogByIdService,
  getAllPublishedBlogsService,
} = require("../services/blog.service");
const {
  updateBlogSchema,
  createBlogSchema,
  paramIdSchema,
  queryParamSchema,
} = require("../middleware/validation");

// Create Blog Post
const createBlog = async (req, res) => {
  validate(createBlogSchema, req.body);
  const blog = await createBlogService(req.user.id, req.body);
  if (blog) {
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  }
};

// Get Blog post by ID
const getBlog = async (req, res) => {
  const { id } = validate(paramIdSchema, req.params);

  const data = await getBlogByIdService(id);
  if (data) {
    return res
      .status(200)
      .json({ success: true, message: "Successfully retrieved Blog", data });
  }
  throw new Error("Blog post not found", 404);
};

// Get all blog posts
const getAllBlogs = async (req, res) => {
  const values = validate(queryParamSchema, req.query);
  const { order, order_by, page, limit } = values;

  const { state } = req.query;

  // get the author id from the user object
  const authorId = req.user.id; //check later

  const { blogs, allCount } = await getAllBlogsService({
    order,
    order_by,
    page,
    limit,
    state,
    authorId,
  });
  const totalPages = Math.ceil(data.allCount / limit);

  const metaData = {
    page: page,
    limit: limit,
    allCount: allCount,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };

  return res.status(200).json({
    success: true,
    message: totalPages ? "Successfully retrieved all blogs" : "No blogs found",
    data: { blogs, allCount, totalPages },
    metaData,
  });
};

//  Get all pusblished blog post
const getAllPublishedBlogs = async (req, res) => {
  const values = validate(queryParamSchema, req.query);
  const { page, limit, order, order_by } = values;

  const { author, title, tags } = req.query;
  const searchParams = { author, title, tags };

  const { blogs, allCount } = await getAllPublishedBlogsService(
    page,
    limit,
    order,
    order_by,
    searchParams
  );

  const totalPages = Math.ceil(allCount / limit);

  const metaData = {
    page: page,
    limit: limit,
    allCount: allCount,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };

  return res.status(200).json({
    success: true,
    message: totalPages ? "Successfully retrieved all blogs" : "No blogs found",
    data: { blogs, allCount, totalPages },
    metaData,
  });
};

// Update blog post
const updateBlog = async (req, res) => {
  const { id } = validate(paramIdSchema, req.params);
  validate(updateBlogSchema, req.body);
  const blog = await updateBlogService({
    id,
    userId: req.user.id,
    data: req.body,
  });
  if (blog) {
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  }
};

//  p
const publishBlog = async (req, res) => {
  const { id } = validate(paramIdSchema, req.params);
  const blog = await publishBlogService(id, req.user.id);
  if (blog) {
    return res.status(200).json({
      success: true,
      message: " Blog published successfully",
      data: blog,
    });
  }
};

//  Delete blog post
const deleteBlog = async (req, res) => {
  const { id } = validate(paramIdSchema, req.params);
  const data = await deleteBlogService(id, req.user.id);
  if (data) {
    return res.status(204).json({ message: "Blog deleted successfully" });
  }
};

module.exports = {
  createBlog,
  getBlog,
  getAllBlogs,
  getAllPublishedBlogs,
  updateBlog,
  publishBlog,
  deleteBlog,
};
