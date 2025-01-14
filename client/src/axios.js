import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ubah ke http:// jika belum mengonfigurasi HTTPS di localhost
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000' // Ganti dengan URL frontend Anda jika menggunakan port berbeda
  }
});

export default api;
