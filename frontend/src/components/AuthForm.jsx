import React, { useState } from "react";

const AuthForm = ({ onSubmit, showLogin, onToggleMode, loading, error }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, showLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-600 to-red-700">
      <div className="max-w-md w-full p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-10 transition-all duration-300 hover:shadow-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {showLogin ? "Welcome Back TaskFlow" : "Join TaskFlow"}
            </h2>
            <p className="text-gray-700">
              {showLogin ? "Sign in to continue" : "Create your account"}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {!showLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none transition"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none transition"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none transition"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            {error && (
              <div className="text-red-700 text-sm bg-red-100 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-700 to-pink-700 text-white font-bold rounded-xl hover:from-purple-800 hover:to-pink-800 focus:outline-none focus:ring-3 transition disabled:opacity-60"
            >
              {loading ? "Processing..." : showLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onToggleMode}
              className="text-purple-700 hover:text-purple-800 font-medium transition"
            >
              {showLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
