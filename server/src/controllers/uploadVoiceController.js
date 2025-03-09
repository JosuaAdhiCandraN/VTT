const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const FASTAPI_URL = "http://localhost:8001/transcribe";

const uploadAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const audioFilePath = path.join(__dirname, "../../temp", req.file.filename);

  // ✅ Pastikan file ada sebelum dikirim ke FastAPI
  if (!fs.existsSync(audioFilePath)) {
    console.error("❌ File not found at:", audioFilePath);
    return res.status(500).json({ error: "File tidak ditemukan di server" });
  }

  try {
    console.log("🚀 Received file from frontend:", req.file);

    // ✅ Gunakan FormData dengan benar
    const formData = new FormData();
    const fileStream = fs.createReadStream(audioFilePath);

    formData.append("file", fileStream, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    console.log("📤 Sending file to FastAPI...");

    // ✅ Kirim file ke FastAPI dengan header yang sesuai
    const response = await axios.post(FASTAPI_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
    });

    console.log("🔄 FastAPI Status:", response.status);
    console.log("📄 FastAPI Response:", response.data);

    res.json({
      message: "File uploaded and transcribed successfully",
      filename: req.file.filename,
      transcription: response.data.transcription,
      label: response.data.label,
    });

    // ✅ Hapus file setelah diproses untuk menghemat penyimpanan
    setTimeout(() => {
      fs.unlink(audioFilePath, (err) => {
        if (err) console.error("❌ Error deleting file:", err);
      });
    }, 5000);
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
