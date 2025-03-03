const express = require("express");
const { saveTranscription } = require("../controllers/transcriptionController");

const router = express.Router();

// Endpoint untuk menerima hasil dari FastAPI
router.post("/save", saveTranscription);

module.exports = router;
