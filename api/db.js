const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const connectionString = process.env.MONGODB_URI;

function connectToMongoDB() {
  mongoose.connect(connectionString);

  mongoose.connection.on("connected", () => {
    console.log("Connection to MongoDB succesfull.");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err);
    console.log(`Error: ${err}`);
  });
}

module.exports = connectToMongoDB;
