import React, { useState } from "react";

const TaskForm = ({ onSubmit, users }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedUser: "",
    priority: "Medium",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      assignedUser: formData.assignedUser || null,
    });
    setFormData({
      title: "",
      description: "",
      assignedUser: "",
      priority: "Medium",
    });
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Create New Task</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xl ${
            isExpanded
              ? "bg-blue-600 text-white rotate-45"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          +
        </button>
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Task title..."
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <textarea
              placeholder="Task description..."
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                value={formData.assignedUser}
                onChange={(e) =>
                  setFormData({ ...formData, assignedUser: e.target.value })
                }
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-800 transition"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
