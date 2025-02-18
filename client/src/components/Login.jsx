import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
    const [data, setData] = useState({ username: "", password: "" }); // Menggunakan username bukan email
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleCheckboxChange = () => {
        setRememberMe(!rememberMe);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error state before making request
        try {
            // Menggunakan URL yang tepat untuk API login (pastikan URL benar sesuai lingkungan)
            const response = await axios.post('https://localhost:5000/api/auth/login', {
                username: data.username, // Menggunakan username
                password: data.password
            }, { withCredentials: true });

            // Mengecek apakah login berhasil
            if (response.status === 200) {
                if (rememberMe) {
                    localStorage.setItem("username", data.username); // Menyimpan username di localStorage
                } else {
                    localStorage.removeItem("username"); // Hapus username jika tidak diingat
                }

                onLoginSuccess(); // Panggil callback onLoginSuccess
                navigate('/app'); // Navigasi ke halaman setelah login
            }
        } catch (error) {
            // Menangani error dengan lebih baik
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message || "Login failed. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setLoading(false); // Set loading ke false setelah proses selesai
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={data.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={data.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={handleCheckboxChange}
                        />
                        Remember me
                    </label>
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div>
                <Link to="/forgot-password">Forgot password?</Link>
            </div>
        </div>
    );
};

export default Login;
