const { default: makeWASocket } = require('@adiwajshing/baileys');  
const fs = require('fs');  
  
const sendMessageToWhatsApp = async (req, res) => {  
    const { number, text } = req.body; // Assuming you send number and text in the request body  
  
    const authFile = './auth_info.json';  
    let authState;  
  
    if (fs.existsSync(authFile)) {  
        authState = JSON.parse(fs.readFileSync(authFile, 'utf-8'));  
    } else {  
        return res.status(500).json({ success: false, message: "Authentication file not found." });  
    }  
  
    const sock = makeWASocket({ auth: authState });  
  
    sock.ev.on('auth-state.updated', (state) => {  
        fs.writeFileSync(authFile, JSON.stringify(state, null, 2));  
    });  
  
    const formattedNumber = `${number.replace(/^0/, '+62')}@s.whatsapp.net`;  
  
    try {  
        await sock.sendMessage(formattedNumber, { text });  
        res.json({ success: true, message: `Message sent to ${formattedNumber}` });  
    } catch (error) {  
        console.error("Error sending message:", error);  
        res.status(500).json({ success: false, message: "Error sending message." });  
    }  
};  
  
module.exports = { sendMessageToWhatsApp };  
