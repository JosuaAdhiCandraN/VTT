const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadAudio } = require("../controllers/uploadVoiceController");

const router = express.Router();

// Konfigurasi penyimpanan file menggunakan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "temp/"); // Simpan file sementara di folder temp
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Gunakan nama unik
  },
});

const upload = multer({ storage });

// Route untuk mengunggah dan langsung transkripsi audio
router.post("/upload", upload.single("audio"), uploadAudio);

module.exports = router;
