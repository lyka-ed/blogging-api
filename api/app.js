import express from "express";
import connectToMongoDB from "./src/config/db.js";
const PORT = process.env.PORT || 5000;

// Middleware
const app = express();

// Database Connection
connectToMongoDB();

app.listen(PORT, () => {
  console.log(`This server is listening at port ${PORT}`);
});
