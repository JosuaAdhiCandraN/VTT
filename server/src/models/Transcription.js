const mongoose = require("mongoose");

const TranscriptionSchema = new mongoose.Schema({
  transcription: { type: String, required: true },
  label: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transcription", TranscriptionSchema);
