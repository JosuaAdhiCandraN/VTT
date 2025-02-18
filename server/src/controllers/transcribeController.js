const { spawn } = require("child_process");
const fs = require("fs");

exports.transcribeAudio = (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const audioPath = req.file.path;
    console.log(`Processing audio: ${audioPath}`);

    // Jalankan skrip Python untuk transkripsi
    const pythonProcess = spawn("python", ["transcribe.py", audioPath]);

    let transcription = "";

    pythonProcess.stdout.on("data", (data) => {
        transcription += data.toString();
    });

    pythonProcess.on("close", () => {
        console.log("Transcription completed:", transcription);
        fs.unlinkSync(audioPath); // Hapus file setelah diproses
        res.json({ text: transcription.trim() });
    });
};
