const Transcription = require("../models/Transcription");

// Simpan hasil transkripsi dari FastAPI ke MongoDB
const saveTranscription = async (req, res) => {
  try {
    const {transcription, label } = req.body;

    if (!transcription || !label) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Simpan ke MongoDB
    const newTranscription = new Transcription({
      transcription,
      label
    });

    await newTranscription.save();
    res.json({ message: "Data saved to MongoDB", data: newTranscription });

  } catch (error) {
    console.error("Error saving to MongoDB:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
};

module.exports = { saveTranscription };
