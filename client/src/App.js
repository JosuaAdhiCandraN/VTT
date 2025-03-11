import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Loader from "./Loader/Loader";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashbord";
import Transcriptiont from "./components/Transcription";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="justify-start font-sans font-semibold">
      <Routes>
        {/* Halaman utama */}
        <Route path="/" element={<Welcome />} />

        {/* Halaman login */}
        <Route path="/login" element={<Login />} />

        {/* Proteksi URL dengan PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/app" element={<Home />} />
          <Route path="/transcription" element={<Transcriptiont />} />
          <Route path="/admin" element={<Dashboard />} />
        </Route>

        {/* Redirect jika tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
