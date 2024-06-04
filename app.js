const app = require("./index");
const dotenv = require("dotenv");
const connectToMongoDB = require("./db");

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
connectToMongoDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database", error);
    process.exit(1);
  });
