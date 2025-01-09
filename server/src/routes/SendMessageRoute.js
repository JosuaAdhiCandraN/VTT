const express = require('express');  
const { sendMessageToWhatsApp } = require('../controllers/SendMessageController');  
  
const router = express.Router();  
  
router.post('/WA', sendMessageToWhatsApp);  
  
module.exports = router;  
