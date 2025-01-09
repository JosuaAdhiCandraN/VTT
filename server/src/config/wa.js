const { default: makeWASocket, useSingleFileAuthState } = require('@adiwajshing/baileys');  
const fs = require('fs');  
  
const startWhatsApp = async () => {  
    const { state, saveState } = await useSingleFileAuthState('./auth_info.json');  
  
    const sock = makeWASocket({  
        auth: state,  
    });  
  
    sock.ev.on('auth-state.updated', saveState);  
  
    sock.ev.on('connection.update', async (update) => {  
        const { connection, lastDisconnect } = update;  
        if (connection === 'close') {  
            console.log('Connection closed. Reconnecting...', lastDisconnect.error);  
            startWhatsApp(); // Reconnect if disconnected  
        } else if (connection === 'open') {  
            console.log('Connected to WhatsApp!');  
        }  
    });  
  
    // Wait for QR code to be scanned  
    sock.ev.on('creds.update', saveState);  
};  
  
startWhatsApp();  
