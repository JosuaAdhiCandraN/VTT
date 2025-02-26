// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Load environment variables
dotenv.config();
const app = express();

// CORS options
const corsOptions = {
  origin: [
    "http://localhost:3000", // Frontend dev environment
    "http://localhost:5000", // Backend dev environment
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Setup database connection
const connectDB = require("./src/config/db");
connectDB();

app.use(express.json());
app.use(morgan("dev"));

// import routes
const userRoutes = require("./src/routes/UserRoutes");
const authRoutes = require("./src/routes/AuthRoute");
const uploadRoutes = require("./src/routes/uploadRoute"); 

// User routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/audio", uploadRoutes);

app.post("/getTranscription", async (req, res) => {
  const { fileName } = req.body;

  try {
    // Baca transkripsi dari file atau database
    const transcription = await fs.promises.readFile(`./transcripts/${fileName}.txt`, "utf8");
    
    res.json({ transcription });
  } catch (error) {
    console.error("Error fetching transcription:", error);
    res.status(500).json({ error: "Failed to retrieve transcription" });
  }
});


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
