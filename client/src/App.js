import logo from './logo.svg';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  return (
    <div className="justify-start font-sans font-semibold">
        <Routes>
            <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<Signup />} />
            {isAuthenticated ? (
                <>
                    <Route path="/app" element={<Home />} />
                    <Route path="/search" element={<FindPage />} />
                    <Route path="/spaces/:_id" element={<SpacePage />} />
                    <Route path="/booking-receipt/:_id" element={<BookingReceipt />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/setting" element={<Setting />} />
                    <Route path="*" element={<Navigate to="/app" replace />} /> {/* Redirect unknown paths */}
                </>
            ) : (
                <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            )}
        </Routes>
    </div>
);
}

export default App;
