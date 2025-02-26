const path = require("path");
const fs = require("fs");

// Pastikan folder `temp/` ada sebelum digunakan
const tempDir = "temp/";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Fungsi untuk menangani unggahan file
const uploadAudio = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    filePath: `/temp/${req.file.filename}`,
  });
};

// Pastikan diekspor dengan benar
module.exports = { uploadAudio };
