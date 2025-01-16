const express = require('express');
const router = express.Router();
const audioController = require('../controllers/AudioController')

// Endpoint untuk upload audio
router.post('/upload', audioController.uploadAudio);

module.exports = router;
