const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Successfully connected to Database!`);
  } catch (err) {
    console.error("Failed to connect to Database:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
