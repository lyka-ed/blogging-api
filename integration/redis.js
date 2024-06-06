const redis = require("redis");

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

redisClient.on("connect", () => {
  console.log("Redis Client is Connected");
});

redisClient.on("error", (error) => {
  console.log("Redis Client Error", error);
});

module.exports = redisClient;
