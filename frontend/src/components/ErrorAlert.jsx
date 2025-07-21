import React from "react";

const ErrorAlert = ({ message, onClose }) => (
  <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-5 flex items-start justify-between">
    <div className="flex items-center">
      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-red-800 font-medium text-sm">{message}</p>
    </div>
    <button
      onClick={onClose}
      className="text-red-500 hover:text-red-700 focus:outline-none rounded-full p-1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  </div>
);

export default ErrorAlert;
