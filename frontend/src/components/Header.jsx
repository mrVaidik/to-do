import React from "react";

const Header = ({ user, onLogout }) => (
  <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-10">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold">
          T
        </div>
        <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-gray-50 rounded-full pr-3 py-1">
          <div className="w-7 h-7 bg-blue-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-blue-700">
              {user.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-800">{user.username}</span>
        </div>
        <button
          onClick={onLogout}
          className="px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
);

export default Header;
