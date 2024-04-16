import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectionString = process.env.MONGODB_URI;
// Connection to mongoDB
function connectToMongoDB() {
  mongoose.connect(connectionString);

  mongoose.connection.on("connected", () => {
    console.log("Connection To MongoDB Successsful.");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err);
    console.log(`Error: ${err}`);
  });
}

export default connectToMongoDB;
