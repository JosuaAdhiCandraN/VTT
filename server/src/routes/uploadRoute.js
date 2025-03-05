const express = require("express");
const multer = require("multer");
const { uploadAudio } = require("../controllers/uploadVoiceController");

const router = express.Router();

const tempPath = path.resolve(__dirname, "../../temp");
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}

// Simpan file dengan ekstensi asli
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadAudio);

module.exports = router;
