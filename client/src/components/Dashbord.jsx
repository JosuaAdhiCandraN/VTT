import React, { useState } from "react";

const Dashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, username: "Aaaaaaaaa", password: "****" },
    { id: 2, username: "Bbbbbbbbbb", password: "****" },
  ]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseCreate = () => {
    if (formData.username || formData.password) {
      setIsCancelModalOpen(true);
    } else {
      setIsCreateModalOpen(false);
    }
  };

  const confirmCancel = () => {
    setIsCancelModalOpen(false);
    setIsCreateModalOpen(false);
    setFormData({ username: "", password: "" });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      setShowConfirmation(true);
    }
  };

  const confirmCreate = () => {
    setShowConfirmation(false);
    const newUser = {
      id: users.length + 1,
      ...formData,
    };
    setUsers([...users, newUser]);
    setFormData({ username: "", password: "" });
    setIsCreateModalOpen(false);

    // Add transition by delaying success notification
    setTimeout(() => setShowSuccess(true), 100);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const confirmDelete = () => {
    setUsers(users.filter((user) => user.id !== deletingUser.id));
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUsers = users.map((user) =>
      user.id === editingUser.id ? { ...user, ...formData } : user
    );
    setUsers(updatedUsers);
    setIsEditModalOpen(false);
    setEditingUser(null);
    setFormData({ username: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-950 to-indigo-950 font-poppins">
      {/* Header Bar */}
      <header className="bg-black p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
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
        </div>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
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
                        <button
                          onClick={() => handleDelete(user)}
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
              onClick={() => setIsDeleteModalOpen(false)}
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
