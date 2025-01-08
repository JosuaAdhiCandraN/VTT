const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log(`Succesfully connected to Database!`);
  } catch (err) {
    console.log(`Failed to connect to Database!`);
    console.log(err);
    process.exit(1); // Exit on failure
  }
};

module.exports = connectDB;
