// uploadRoute.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadAudio } = require("../controllers/uploadVoiceController");

const router = express.Router();

// Pastikan folder temp ada sebelum upload
const tempPath = path.resolve(__dirname, "../../temp");
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}

const upload = multer({ dest: tempPath });

router.post("/upload", upload.single("file"), uploadAudio);

module.exports = router;
