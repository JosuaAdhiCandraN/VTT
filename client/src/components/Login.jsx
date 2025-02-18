import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

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
      // Kirim permintaan POST ke backend
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      const { message } = response.data;
      document.cookie = `token=${response.data.token}; path=/;`;
      alert(message);l
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };


  const handleBack = () => {
    navigate("/");
  };

  // Rest of your existing Login component code remains the same
  return (
    <div className="min-h-screen bg-[#020B2C] relative">
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
          <div className="bg-[#091544] rounded-3xl p-8 shadow-xl">
            {/* Logo */}
            <div className="mb-8">
              <div className="text-white/80 flex items-center gap-1 text-sm">
                <span>DISPATCH</span>
                <span>VOX</span>
              </div>
            </div>

            {/* Sign in text */}
            <h1 className="text-4xl font-bold text-white mb-8">Sign in</h1>

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
              <button
                type="submit"
                className="w-full bg-white text-[#091544] py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                SIGN IN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;