const path = require("path");
const fs = require("fs");
const axios = require("axios");

const uploadAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const audioFilePath = path.join(__dirname, "../../temp", req.file.filename);

  console.log(`Processing audio: ${audioFilePath}`);

  try {
    // Kirim file ke FastAPI
    const formData = new FormData();
    formData.append("file", fs.createReadStream(audioFilePath));

    const response = await axios.post("http://localhost:8001/transcribe", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Hapus file setelah dikirim ke FastAPI
    fs.unlink(audioFilePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      } else {
        console.log(`File ${audioFilePath} deleted successfully.`);
      }
    });

    res.json({
      message: "File uploaded and transcribed successfully",
      filename: req.file.filename,
      transcription: response.data.transcription,
    });
  } catch (error) {
    console.error("Error in FastAPI request:", error.response?.data || error.message);
    res.status(500).json({ error: "Transcription failed" });
  }
};

module.exports = { uploadAudio };
