// uploadVoiceController.js

const path = require("path");

const fs = require("fs");

const FormData = require("form-data");

const axios = require("axios");

const FASTAPI_URL = "http://localhost:8001/transcribe";

const uploadAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const audioFilePath = path.resolve(
    __dirname,
    "../../temp",
    req.file.filename
  );

  try {
    console.log("🚀 Received file from frontend:", req.file);

    console.log("📂 Checking if file exists:", fs.existsSync(audioFilePath));

    if (!fs.existsSync(audioFilePath)) {
      return res
        .status(500)
        .json({ error: "File not found in temp directory!" });
    }

    // Gunakan fs.createReadStream() agar file dikirim dengan benar

    const formData = new FormData();

    formData.append(
      "file",
      fs.createReadStream(audioFilePath),
      req.file.originalname
    );

    console.log("📤 Sending file to FastAPI...");

    // Kirim file ke FastAPI

    const response = await axios.post(FASTAPI_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data; boundary=${formData._boundary}",

        ...formData.getHeaders(),
      },

      maxBodyLength: Infinity, // Hindari batasan ukuran file
    });

    console.log("🔄 FastAPI Status:", response.status);

    console.log("📄 FastAPI Response:", response.data);

    res.json({
      message: "File uploaded and transcribed successfully",

      filename: req.file.filename,

      transcription: response.data.transcription,

      label: response.data.label,
    });

    // Hapus file setelah diproses

    setTimeout(() => {
      fs.unlink(audioFilePath, (err) => {
        if (err) console.error("❌ Error deleting file:", err);
        else console.log("✅ File deleted:", audioFilePath);
      });
    }, 5000); // Tunggu 5 detik sebelum menghapus file
  } catch (error) {
    console.error(
      "❌ Axios Error:",
      error.response ? error.response.data : error.message
    );

    res
      .status(500)
      .json({ error: "Transcription failed", details: error.message });
  }
};

module.exports = { uploadAudio };
