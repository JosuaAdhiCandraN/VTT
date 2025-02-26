import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ubah ke http:// jika belum mengonfigurasi HTTPS di localhost
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
