import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Tambahkan logika autentikasi di sini
        navigate('/app'); // Navigasi ke Home Page setelah login berhasil
    };

    return (
        <section className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
                <h1 className="text-xl font-bold text-center mb-6">Sign In</h1>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleLogin}
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
