const winston = require("winston");

const { printf, combine, timestamp, errors, json } = winston.format;

const logFormat = printf(
  ({
    timestamp,
    method,
    message,
    level,
    url,
    status,
    stack,
    ip,
    user,
    ...otherData
  }) => {
    let log = `[${timestamp}] [${level}] ${method} ${url} ${status} ${ip} ${user} `;
    if (stack) {
      log += JSON.stringify(stack);
    }

    if (otherData) {
      log += JSON.stringify({ ...otherData });
    }
    return log;
  }
);

const logger = winston.createLogger({
  level: "info",
  format: combine(
    // label({ label: 'HTTP' }),
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json(),
    logFormat
  ),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
    }),
  ],
});

module.exports = logger;
