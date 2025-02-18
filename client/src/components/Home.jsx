import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    progress: 0,
    success: false,
    fileName: ""
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadState({
        isUploading: true,
        progress: 0,
        success: false,
        fileName: file.name
      });

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadState(prev => ({
          ...prev,
          progress: progress
        }));

        if (progress >= 100) {
          clearInterval(interval);
          setUploadState(prev => ({
            ...prev,
            isUploading: false,
            success: true
          }));

          // Navigate to transcription page after success
          setTimeout(() => {
            navigate('/transcription', { 
              state: { 
                fileName: file.name,
                duration: "1:22", // Sample duration - replace with actual audio duration
                date: new Date().toLocaleString()
              } 
            });
          }, 1500);
        }
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-950 to-indigo-950">
      {/* Header Bar */}
      <header className="bg-black p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M4.93 19.07a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072"
            />
          </svg>
          <span className="text-white font-bold text-xl">DISPATCH VOX</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          LOG OUT
        </button>
      </header>

      {/* Main Content */}
      <section className="flex flex-col items-center p-8">
        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-center mt-16 mb-20 text-white">
          Upload, Transcribe, and Simplify.
        </h1>

        {/* Steps Container */}
        <div className="flex justify-center items-center gap-16 mb-16">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white text-blue-950 flex items-center justify-center font-bold text-xl mb-4">
              1
            </div>
            <div className="text-center text-white">
              <p className="font-medium">Upload</p>
              <p className="font-medium">Your</p>
              <p className="font-medium">Files</p>
            </div>
          </div>

          {/* Connection Line */}
          <div className="w-32 h-0.5 bg-white mt-[-40px]"></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white text-blue-950 flex items-center justify-center font-bold text-xl mb-4">
              2
            </div>
            <div className="text-center text-white">
              <p className="font-medium">Check</p>
              <p className="font-medium">Your</p>
              <p className="font-medium">WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Upload Box */}
        <div className="max-w-xl w-full border-2 border-dashed border-white/30 rounded-lg p-8">
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept="audio/*"
            />
            {!uploadState.isUploading && !uploadState.success && (
              <label
                htmlFor="file-upload"
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-all cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Choose File
              </label>
            )}
            
            {/* Upload Progress */}
            {uploadState.isUploading && (
              <div className="w-full max-w-xs">
                <div className="mb-2 text-white text-center">
                  Uploading {uploadState.fileName}...
                </div>
                <div className="w-full bg-white/20 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadState.progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-white text-center">
                  {uploadState.progress}%
                </div>
              </div>
            )}

            {/* Success Message */}
            {uploadState.success && (
              <div className="text-green-400 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>File uploaded successfully!</span>
              </div>
            )}

            {!uploadState.isUploading && !uploadState.success && (
              <p className="text-center text-white/80">
                Upload an audio file from your local device to transcribe.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;