// Tambahkan endpoint ini jika Anda ingin mengambil transkripsi secara terpisah
// routes/uploadVoiceRoutes.js - Tambahkan route berikut

// Route untuk mengambil transkripsi berdasarkan filePath
router.get("/transcription", (req, res) => {
  const filePath = req.query.filePath;

  if (!filePath) {
    return res.status(400).json({ message: "File path diperlukan" });
  }

  // Cek apakah file ada
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File tidak ditemukan" });
  }

  // Jalankan script transcribe.py
  const transcribeScript = path.join(__dirname, "../transcribe.py");

  exec(
    `python "${transcribeScript}" "${filePath}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error in Python script: ${stderr}`);
        return res.status(500).json({ error: "Transcription failed" });
      }

      res.json({
        transcription: stdout.trim(),
      });
    }
  );
});
