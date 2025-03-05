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

  try {
    // Buat FormData untuk mengirim file ke FastAPI
    const formData = new FormData();
    formData.append("file", fs.createReadStream(audioFilePath), {
      filename: req.file.filename,
      contentType: req.file.mimetype,
    });
    
    const response = await fetch(FASTAPI_URL, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });
    console.log("FastAPI Response in Express:", response.data);

    res.json({
      message: "File uploaded and transcribed successfully",
      filename: req.file.filename,
      transcription: response.data.transcription,
      label: response.data.label
    });

    // Hapus file setelah diproses
    fs.unlink(audioFilePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Transcription failed", details: error.message });
  }
};

module.exports = { uploadAudio };
