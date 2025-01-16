const multer = require('multer');
const fs = require('fs');
const axios = require('axios');

// Konfigurasi multer untuk menyimpan file di folder `temp`
const upload = multer({ dest: 'temp/' });

// Fungsi untuk menangani upload dan pemrosesan audio
exports.uploadAudio = (req, res) => {
  upload.single('audio')(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error uploading file');
    }

    const audioPath = req.file.path;

    try {
      // Kirim file ke layanan ML menggunakan HTTP POST
      const response = await axios.post(
        'http://localhost:5000/process-audio',
        {
          file: fs.createReadStream(audioPath),
        },
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Hapus file audio setelah selesai
      fs.unlinkSync(audioPath);

      // Kirim hasil ke client
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error processing audio:', error.message);
      fs.unlinkSync(audioPath); // Hapus file meskipun terjadi error
      res.status(500).json({ error: 'Error processing audio' });
    }
  });
};
