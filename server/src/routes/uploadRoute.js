const express = require("express");
const multer = require("multer");
const { uploadAudio } = require("../controllers/uploadVoiceController");

const router = express.Router();
const upload = multer({ dest: "../../temp/" });

router.post("/upload", upload.single("file"), uploadAudio);

module.exports = router;