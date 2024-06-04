const Joi = require("joi");

// Sign up
const signupSchema = Joi.object({
  firstname: Joi.string().min(3).required(),
  lastname: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// SignIn
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const paramIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "string.base": "The id must be a string",
    "string.length": "The id must be exactly 24 characters long.",
    "string.hex":
      "The id must contain only hexadecimal characters (0-9 and a-f)",
  }),
});

// Create blog
const createBlogSchema = Joi.object({
  title: Joi.string().min(4).required(),
  description: Joi.string().min(4),
  body: Joi.string().min(10).required(),
  tags: Joi.array().items(Joi.string()),
});

// Update Blog
const updateBlogSchema = Joi.object({
  title: Joi.string().min(4),
  description: Joi.string().min(4),
  body: Joi.string().min(10),
  tags: Joi.array().items(Joi.string()),
});

const queryParamSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).default(20).optional(),
  order_by: Joi.string()
    .valid("created_at", "updated_at", "title", "read_count", "reading_time")
    .default("created_at"),
  order: Joi.string().valid("asc", "desc").default("desc"),
  author: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
  title: Joi.string().trim().optional(),
  tags: Joi.string().trim().optional(),
});

module.exports = {
  signupSchema,
  loginSchema,
  paramIdSchema,
  createBlogSchema,
  updateBlogSchema,
  queryParamSchema,
};
