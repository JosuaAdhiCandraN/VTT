const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Fungsi untuk menangani unggahan file dan transkripsi
const uploadAudio = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const audioPath = req.file.path;
  console.log(`Processing audio: ${audioPath}`);

  // Jalankan skrip Python untuk transkripsi
  const pythonProcess = spawn("python", ["transcribe.py", audioPath]);

  let transcription = "";

  pythonProcess.stdout.on("data", (data) => {
    transcription += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error in Python script: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Error processing audio" });
    }

    console.log("Transcription completed:", transcription);
    fs.unlinkSync(audioPath); // Hapus file setelah diproses

    res.json({
      message: "File uploaded and transcribed successfully",
      filename: req.file.filename,
      transcription: transcription.trim(),
    });
  });
};

module.exports = { uploadAudio };
