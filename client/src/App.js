import React from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Loader from "./Loader/Loader";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Home from "./components/Home";
import './App.css'; 

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

              {/* Fallback for unknown paths */}
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
  );
}

export default App;