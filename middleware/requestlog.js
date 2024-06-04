const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  res.on("finish", () => {
    logger.info("HTTP Request", {
      method: req.method,
      ip: req.ip,
      url: req.originalUrl,
      status: res.statusCode,
      user: req.user ? req.user.id : "Guest",
    });
  });

  next();
};

module.exports = { requestLogger };
