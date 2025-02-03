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
    if (!recaptchaToken) {
      alert("Please verify reCAPTCHA");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, recaptchaToken }),
      });
      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        navigate("/app");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-900">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign in</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6Ldx-LYqAAAAAD-fh4z6ZFJW65qWVgv2vptpNXVp"
              onChange={(value) => setRecaptchaToken(value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
