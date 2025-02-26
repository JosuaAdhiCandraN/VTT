import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import logo from "../assets/Logo.png"; 
import bgImage from "../assets/BG_LoginClient.gif"; 

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      console.log("Login response data:", data); // Add this line for debugging

      if (response.status === 200) {
        // Store the token and role in localStorage for authentication
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role); // Assuming role is in the response

        // Navigate based on role
        if (data.role === "admin") {
          navigate("/admin"); // Admin Dashboard
        } else {
          navigate("/app"); // User's app page
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  // Rest of your existing Login component code remains the same
  return (
    <div
    className="min-h-screen bg-cover bg-center"
    style={{ backgroundImage: `url(${bgImage})` }}
  >
      {/* Back button with navigation */}
      <button
        onClick={handleBack}
        className="absolute left-6 top-6 text-white/70 hover:text-white"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      <div className="min-h-screen flex items-center pl-48">
        <div className="relative w-full max-w-md">
          {/* Main card */}
          <div className="bg-[#091544] rounded-3xl p-8 shadow-xl border-2 border-white">
            {/* Logo */}
            <div className="mb-8">
            <div className="flex items-center space-x-2">
  <img src={logo} alt="Dispatch Vox Logo" className="w-40 h-15" />
</div>
            </div>

            {/* Sign in text */}
            <h1 className="text-4xl font-bold text-white mb-8">Sign In</h1>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/60">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* ReCAPTCHA */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey="6Ldx-LYqAAAAAD-fh4z6ZFJW65qWVgv2vptpNXVp"
                  onChange={(value) => setRecaptchaToken(value)}
                  theme="dark"
                />
              </div>

              {/* Sign in button */}
              <div className="flex justify-center">
              <button
                type="submit"
                className="bg-white text-[#091544] py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors h-15 w-20"
              >
                SIGN IN
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
