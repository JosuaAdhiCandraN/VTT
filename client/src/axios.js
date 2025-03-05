import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Sesuaikan dengan backend Express.js
  withCredentials: true,
});

// Fungsi untuk upload file audio
export const uploadAudio = (formData) => {
  return axios.post("http://localhost:5000/api/audio/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default api;
