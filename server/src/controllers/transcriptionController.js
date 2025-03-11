const Transcription = require("../models/Transcription");

// Simpan hasil transkripsi dari FastAPI ke MongoDB
const saveTranscription = async (req, res) => {
  try {
    console.log("📥 Received request from FastAPI:", req.body); // Debugging

    const { transcription, label } = req.body;

    if (!transcription || !label) {
      console.error("❌ Missing required fields:", req.body);
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Simpan ke MongoDB
    const newTranscription = new Transcription({
      transcription,
      label,
      timestamp: new Date() // Tambahkan timestamp manual
    });

    await newTranscription.save();
    console.log("✅ Data saved to MongoDB:", newTranscription); // Debugging
    res.json({ message: "Data saved to MongoDB", data: newTranscription });

  } catch (error) {
    console.error("❌ Error saving to MongoDB:", error);
    res.status(500).json({ error: "Failed to save data", details: error.message });
  }
};

module.exports = { saveTranscription };
