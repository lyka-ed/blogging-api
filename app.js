const app = require("./index");
const connectToMongoDB = require("./db");

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
