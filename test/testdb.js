const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongodbUri = mongoServer.getUri();
    await mongoose.connect(mongodbUri);
  } catch (error) {
    console.error("Failed to Connect to MongoDB");
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    mongoServer.stop();
  } catch (error) {
    console.error("Failed to Disconnect from MongoDB");
    process.exit(1);
  }
};

export { connectDB, disconnectDB, mongoose };
