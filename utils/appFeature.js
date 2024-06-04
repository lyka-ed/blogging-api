const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
};

// Validate the request body against a schema.
const validate = (schema, data) => {
  if (schema) {
    const { value, error } = schema.validate(data);
    if (error) {
      const errorMessage = error.details[0].message;
      throw new Error(errorMessage);
    }
    return value;
  }
};

// Wrapper for async functions to catch errors and pass them to the error handling middleware.
const wrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Function that calculate the average reading time for a blog post
const getReadingTime = (blogContent) => {
  const totalWords = blogContent.split(" ").length;
  // Assume that it takes 1 minute to read 40 words
  return Math.ceil(totalWords / 40);
};

// Comfirm token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  wrapper,
  validate,
  verifyToken,
  hashPassword,
  comparePassword,
  generateToken,
  getReadingTime,
};
