import React from "react";

const ActivityLog = ({ actions }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-3">
      {actions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No activity yet</p>
      ) : (
        actions.map((action) => (
          <div
            key={action._id}
            className={`p-4 rounded-lg border-l-4 ${
              action.action.includes("CREATED")
                ? "border-green-500 bg-green-50"
                : action.action.includes("UPDATED")
                ? "border-blue-500 bg-blue-50"
                : action.action.includes("DELETED")
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  {action.user?.username || "System"}{" "}
                  <span className="text-gray-600">
                    {action.action.toLowerCase().replace("_", " ")}
                  </span>
                </p>
                <p className="text-gray-700 text-sm">{action.details}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-3">
                {new Date(action.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default ActivityLog;
