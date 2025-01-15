import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Verifikasi apakah reCAPTCHA sudah terisi
    if (!recaptchaToken) {
      alert("Please verify reCAPTCHA");
      return;
    }

    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        recaptchaToken,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem("token", data.token); // Menyimpan token ke localStorage
      navigate("/app"); // Navigasi ke Home Page setelah login berhasil
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* reCAPTCHA */}
          <div className="mb-4">
            <ReCAPTCHA
              sitekey="6Ldx-LYqAAAAAD-fh4z6ZFJW65qWVgv2vptpNXVp" // Ganti dengan Site Key Anda
              onChange={(value) => setRecaptchaToken(value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
