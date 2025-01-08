// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

// Setup database connection
const connectDB = require("./src/config/db");
connectDB();

// Initialize Express app
const app = express();

// Basic route
app.get("/", (req, res) => {
    res.send("Welcome to VCT API!");
});

// Set the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
