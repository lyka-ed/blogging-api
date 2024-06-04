const logger = require(".././utils/logger.js");

// const errorHandler = (error, req, res, next) => {
//   if (error) {
//     if (error.message) {
//       console.log("Error message", error.message);
//       logger.error(error.message, {
//         method: req.method,
//         url: req.originalUrl,
//         ip: req.ip,
//         status: error.status,
//         user: req.user ? req.user.id : "Guest",
//         stack: error.stack,
//       });
//       res.status(400).json({
//         status: failed,
//         error: error.message,
//       });
//     } else {
//       res.status(500).json({
//         status: failed,
//         error: error,
//       });
//     }
//     return;
//   } else {
//     next();
//   }
// };

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const success = err.success || false;
  const message = err.message || "Something went wrong";

  // Log the error
  logger.error(message, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    status: status,
    user: req.user ? req.user.id : "Guest",
    stack: err.stack,
  });

  const cleanedMessage = message.replace(/"/g, "");
  res.status(status).json({ success, message: cleanedMessage });
};

module.exports = { errorHandler };
