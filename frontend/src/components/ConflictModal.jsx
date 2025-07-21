import React from "react";

const ConflictModal = ({ conflictData, onResolve, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
      <h3 className="text-xl font-bold text-red-700 mb-4 text-center">
        Conflict Detected!
      </h3>
      <p className="text-gray-700 mb-5 text-center">
        This task was modified by another user. What would you like to do?
      </p>

      <div className="space-y-3 mb-5">
        <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
          <p className="font-bold text-sm text-gray-800 mb-1">
            Your Proposed Changes:
          </p>
          <p className="text-xs text-gray-700">
            Title: {conflictData.attemptedUpdate.title || "N/A"}
          </p>
          <p className="text-xs text-gray-700">
            Description: {conflictData.attemptedUpdate.description || "N/A"}
          </p>
          <p className="text-xs text-gray-700">
            Status: {conflictData.attemptedUpdate.status || "N/A"}
          </p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="font-bold text-sm text-yellow-800 mb-1">
            Current Server Version:
          </p>
          <p className="text-xs text-yellow-700">
            Title: {conflictData.currentTask.title || "N/A"}
          </p>
          <p className="text-xs text-yellow-700">
            Description: {conflictData.currentTask.description || "N/A"}
          </p>
          <p className="text-xs text-yellow-700">
            Status: {conflictData.currentTask.status || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => onResolve("overwrite")}
          className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          Overwrite
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
        >
          Keep Server
        </button>
      </div>
    </div>
  </div>
);

export default ConflictModal;
