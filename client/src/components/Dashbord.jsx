import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import logo from "../assets/Logo.png"; 
import bgImage from "../assets/BG_Admin.png"; 
=======
>>>>>>> b2329f183aca1c5311eef1082904f2e434b05909

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        const data = await response.json();
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", formData);
      fetchUsers(); // Re-fetch users to update the list
      setFormData({ username: "", password: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDelete = async (user) => {
    try {
      // Langsung delete menggunakan username
      await axios.delete(`http://localhost:5000/api/users/${user.username}`);
      console.log("User deleted successfully");
      fetchUsers(); // Refresh list setelah berhasil delete
    } catch (error) {
      console.error("Error deleting user:", error);
      // Optional: Tambahkan feedback ke user
      if (error.response?.status === 404) {
        alert("User not found");
      } else {
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, password: "" }); // Pre-fill the form with current user data
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCloseCreate = () => {
    setIsCreateModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/users/${editingUser.username}`,
        formData
      );
      fetchUsers(); // Re-fetch after updating
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const confirmCreate = () => {
    setShowConfirmation(false);
    handleCreate();
  };

  const confirmCancel = () => {
    setIsCancelModalOpen(false);
    setFormData({ username: "", password: "" });
  };

  const confirmDelete = async () => {
    await handleDelete(editingUser.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-950 to-indigo-950 font-poppins">
      {/* Header Bar */}
      <header className="bg-black p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
<<<<<<< HEAD
  <img src={logo} alt="Dispatch Vox Logo" className="w-40 h-15" />
=======
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M4.93 19.07a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072"
            />
          </svg>
          <span className="text-white font-bold text-xl">DISPATCH VOX</span>
>>>>>>> b2329f183aca1c5311eef1082904f2e434b05909
        </div>
        <button
          onClick={() => handleLogout()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          LOG OUT
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        <div className="w-full max-w-3xl">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <span className="text-xl">+</span> CREATE
            </button>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-gray-700">#</th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Username
                  </th>
                  <th className="px-6 py-3 text-right text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{user.id}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          EDIT
                        </button>
                        {/* Di bagian tabel */}
                        <button
                          onClick={() => handleDelete(user)} // Pastikan passing user object lengkap
                          className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
          <div className="bg-green-500 p-8 rounded-lg w-96 relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={handleCloseCreate}
              className="absolute top-2 right-2 text-white hover:text-gray-200"
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal title */}
            <div className="flex items-center gap-2 text-white mb-6">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-xl font-bold">CREATE</span>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-white mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded text-lg"
                  placeholder="Enter username"
                />
              </div>
              <div className="mb-6">
                <label className="block text-white mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-green-500 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                CREATE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">Create account?</h3>
            <p className="mb-6">Please verify that all details are correct.</p>
            <div className="flex gap-4">
              <button
                onClick={confirmCreate}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600"
              >
                YES
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">Cancel create account?</h3>
            <p className="mb-6">The current progress will not be saved.</p>
            <div className="flex gap-4">
              <button
                onClick={confirmCancel}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600"
              >
                YES
              </button>
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 animate-slideIn">
          <div className="flex items-center gap-2">
            <span className="font-bold">Account created successfully.</span>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-blue-600 p-8 rounded-lg w-96 relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-200"
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Modal title */}
            <div className="flex items-center gap-2 text-white mb-6">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="text-xl font-bold">EDIT</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-white mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  defaultValue={editingUser?.username}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded text-lg"
                />
              </div>
              <div className="mb-6">
                <label className="block text-white mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  defaultValue={editingUser?.password}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-blue-600 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                SAVE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-red-600 p-8 rounded-lg w-96 relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="absolute top-2 right-2 text-white hover:text-gray-200"
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Delete Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            </div>

            {/* Delete Message */}
            <div className="text-center text-white mb-6">
              <h3 className="text-xl font-bold mb-2">Delete this account?</h3>
              <p className="text-white text-opacity-90">
                Your action cannot be restored.
              </p>
            </div>

            {/* Delete Button */}
            <button
              onClick={confirmDelete}
              className="w-full bg-white text-red-600 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              DELETE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
