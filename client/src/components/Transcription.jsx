import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Logo.png"; 
import bgImage from "../assets/BG_MainClient.png"; 

const Transcription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileName, duration, date } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(true);

  // Simulate transcription process
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNewUpload = () => {
    navigate("/app");
  };

  const handleCopyText = () => {
    // Copy functionality will be implemented later
    alert("Copy functionality will be implemented!");
  };

  return (
    <div
    className="min-h-screen bg-cover bg-center"
    style={{ backgroundImage: `url(${bgImage})` }}
  >
      {/* Header Bar - Matching Home Page */}
      <header className="bg-black p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
        <img src={logo} alt="Dispatch Vox Logo" className="w-40 h-15" />
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          LOG OUT
        </button>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-8 max-w-4xl">
        {/* File Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">{fileName}</h2>
              <span className="text-white/80">{duration}</span>
              <span className="text-white/80">{date}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCopyText}
                className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 flex items-center gap-2"
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
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Copy Text
              </button>
              <button
                onClick={handleNewUpload}
                className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900"
              >
                New Upload
              </button>
            </div>
          </div>
        </div>

        {/* Empty Transcription Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p className="text-white">Processing your audio file...</p>
            </div>
          ) : (
            <div className="min-h-[400px] flex items-center justify-center">
              <p className="text-white/60">Transcription will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transcription;
