import React from "react";

const TabNavigation = ({ activeTab, onTabChange }) => (
  <div className="flex space-x-2 bg-white rounded-xl p-2 shadow-inner mb-6">
    <button
      onClick={() => onTabChange("board")}
      className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition ${
        activeTab === "board"
          ? "bg-blue-600 text-white shadow hover:bg-blue-700"
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      Kanban Board
    </button>
    <button
      onClick={() => onTabChange("activity")}
      className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition ${
        activeTab === "activity"
          ? "bg-blue-600 text-white shadow hover:bg-blue-700"
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      Activity Log
    </button>
  </div>
);

export default TabNavigation;
