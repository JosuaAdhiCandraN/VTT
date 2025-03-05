const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

const FASTAPI_URL = "http://localhost:8001/transcribe";

const uploadAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const audioFilePath = path.join(__dirname, "../../temp", req.file.filename);

  try {
    console.log("🚀 Received file from frontend:", req.file);

    // **Gunakan fs.createReadStream() agar file dikirim dengan benar**
    const formData = new FormData();
    formData.append("file", fs.createReadStream(audioFilePath));

    console.log("📤 Sending file to FastAPI...");

    // ✅ Gunakan axios untuk mengirim file ke FastAPI
    const response = await axios.post(FASTAPI_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity, // ✅ Hindari batasan ukuran file
    });

    console.log("🔄 FastAPI Status:", response.status);
    console.log("📄 FastAPI Response:", response.data);

    res.json({
      message: "File uploaded and transcribed successfully",
      filename: req.file.filename,
      transcription: response.data.transcription,
      label: response.data.label,
    });

    // **Hapus file setelah diproses**
    fs.unlink(audioFilePath, (err) => {
      if (err) console.error("❌ Error deleting file:", err);
    });

  } catch (error) {
    console.error("❌ Axios Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Transcription failed", details: error.message });
  }
};

module.exports = { uploadAudio };
