import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [audio, setAudio] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "/login"; 
        } else {
            const data = await response.json();
            alert(data.message || "Logout failed");
        }
    } catch (error) {
        console.error("Logout error:", error);
        alert("An error occurred. Please try again.");
    }
};

const handleFileChange = (event) => {
  setAudio(event.target.files[0]);
};


const handleUpload = async () => {
  if (!audio) {
    alert("Pilih file audio terlebih dahulu!");
    return;
  }

  setIsUploading(true);
  const formData = new FormData();
  formData.append("audio", audio);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/audio/upload", // Sesuaikan dengan route backend
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    setIsUploading(false);

    navigate("/transcription", {
      state: {
        fileName: audio.name,
        filePath: res.data.filePath,
        date: new Date().toLocaleString(),
      },
    });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error);
    alert("Gagal mengunggah audio.");
    setIsUploading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-950 to-indigo-950">
      <header className="bg-black p-4 flex justify-between items-center">
        <span className="text-white font-bold text-xl">DISPATCH VOX</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          LOG OUT
        </button>
      </header>

      <section className="flex flex-col items-center p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center mt-16 mb-20 text-white">
          Upload, Transcribe, and Simplify.
        </h1>

        <div className="max-w-xl w-full border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            Pilih File Audio
          </label>
          <p className="text-white mt-4">
            {audio ? audio.name : "Tidak ada file yang dipilih"}
          </p>

          <button
            onClick={handleUpload}
            className={`mt-4 px-6 py-3 rounded-lg text-white ${
              isUploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isUploading}
          >
            {isUploading ? "Mengunggah..." : "Unggah dan Transkrip"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
