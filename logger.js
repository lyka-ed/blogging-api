const winston = require("winston");

const createLogger = winston.createLogger;
const format = winston.format;
const transports = winston.transports;

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app.log" }),
  ],
});

module.exports = logger;
