const express = require("express");
const multer = require("multer");
const { transcribeAudio } = require("../controllers/transcribeController");

const router = express.Router();

// Menyimpan file sementara di folder temp
const upload = multer({ dest: "temp/" });

router.post("/transcribe", upload.single("audio"), transcribeAudio);

module.exports = router;
