import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Loader from "./Loader/Loader";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashbord";
import Transcriptiont from "./components/Transcription";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="justify-start font-sans font-semibold">
      <Routes>
        {/* Landing Page route */}
        <Route path="/" element={<Welcome />} />

        {/* Login Page route */}
        <Route path="/login" element={<Login />} />

        {/* Home Page route */}
        <Route path="/app" element={<Home />} />

        {/* Home Page route */}
        <Route path="/transcription" element={<Transcriptiont />} />

        {/* Dashboard Page route */}
        <Route path="/admin" element={<Dashboard />} />

        {/* Fallback for unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Helper function to retrieve a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}

export default App;
