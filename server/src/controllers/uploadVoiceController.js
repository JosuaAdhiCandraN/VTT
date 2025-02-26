const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

// Fungsi untuk menangani unggahan file
const uploadAudio = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const audioFilePath = path.join(__dirname, "../../temp", req.file.filename); // Pastikan path benar
  const transcribeScript = path.join(__dirname, "../transcribe.py"); // Path ke transcribe.py

  console.log(`Processing audio: ${audioFilePath}`);

  exec(`python "${transcribeScript}" "${audioFilePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error in Python script: ${stderr}`);
      return res.status(500).json({ error: "Transcription failed" });
    }
  // Setelah transkripsi berhasil, hapus file audio
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
      transcription: stdout.trim(), // Hasil transkripsi
    });
  });
};

module.exports = { uploadAudio };
