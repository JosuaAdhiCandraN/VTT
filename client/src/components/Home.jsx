import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAudio } from "../axios";
import api from "../axios";
import logo from "../assets/Logo.png";
import bgImage from "../assets/BG_MainClient.png";

const Home = () => {
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState("");
  const [audio, setAudio] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "record"
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
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
    formData.append("file", audio);

    try {
      const response = await fetch("http://localhost:5000/api/audio/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      // Simpan hasil transkripsi ke state
      setResponseMessage(
        `Transcription: ${data.transcription}, Label: ${data.label}`
      );

      // 🚀 Pindah ke halaman hasil transkripsi
      navigate("/transcription", {
        state: { transcription: data.transcription, label: data.label },
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengunggah audio: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioFile = new File([audioBlob], "recorded_audio.wav", {
          type: "audio/wav",
        });
        setAudio(audioFile);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Tidak bisa mengakses mikrofon");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // Function to handle sliding to previous or next tab
  const slideTab = (direction) => {
    if (direction === "next") {
      setActiveTab(activeTab === "upload" ? "record" : "upload");
    } else {
      setActiveTab(activeTab === "upload" ? "record" : "upload");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <header className="bg-black p-4 flex justify-between items-center">
        <img src={logo} alt="Dispatch Vox Logo" className="w-40 h-15" />
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          LOG OUT
        </button>
      </header>
      <section className="flex flex-col items-center p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center mt-16 mb-10 text-white">
          Upload, Record, Transcribe, and Simplify.
        </h1>

        {/* Card container with full width */}
        <div className="max-w-xl w-full relative overflow-hidden">
          {/* Carousel container */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${
                activeTab === "upload" ? "0%" : "-50%"
              })`,
              width: "200%", // Make sure it has room for both cards
            }}
          >
            {/* Upload Card */}
            <div className="w-1/2 p-2">
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center h-full">
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
                <p className="text-white mt-4 min-h-6">
                  {audio ? audio.name : "Tidak ada file yang dipilih"}
                </p>
                <button
                  onClick={handleUpload}
                  className={`mt-4 px-6 py-3 rounded-lg text-white ${
                    isUploading
                      ? "bg-gray-500"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={isUploading}
                >
                  {isUploading ? "Mengunggah..." : "Unggah dan Transkrip"}
                </button>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => slideTab("next")}
                    className="text-white text-sm flex items-center hover:text-blue-300 transition-colors"
                  >
                    <span>Geser untuk merekam</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Record Card */}
            <div className="w-1/2 p-2">
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center h-full">
                <div className="mb-4">
                  <div
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                      recording ? "animate-pulse bg-red-600" : "bg-white/20"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                </div>

                <p className="text-white mb-4">
                  {recording ? "Merekam..." : "Siap untuk merekam"}
                </p>

                <p className="text-white mt-4 min-h-6">
                  {audio && audio.name === "recorded_audio.wav"
                    ? "Audio rekaman siap"
                    : ""}
                </p>

                {recording ? (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-lg text-white bg-red-600 hover:bg-red-700"
                  >
                    Stop Recording
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className="px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700"
                  >
                    Start Recording
                  </button>
                )}

                {audio && audio.name === "recorded_audio.wav" && (
                  <button
                    onClick={handleUpload}
                    className="mt-4 ml-4 px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                    disabled={isUploading}
                  >
                    {isUploading ? "Mengunggah..." : "Unggah Rekaman"}
                  </button>
                )}

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => slideTab("prev")}
                    className="text-white text-sm flex items-center hover:text-blue-300 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span>Kembali ke upload</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
