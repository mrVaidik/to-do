import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({
  task,
  users,
  onEdit,
  onDelete,
  onSmartAssign,
  onUpdate,
  isEditing,
  setEditingTask,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    assignedUser: task.assignedUser?._id || "",
    priority: task.priority,
  });

  const priorityColors = {
    Low: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    High: "bg-red-100 text-red-800 border-red-200",
  };

  const handleSave = () => {
    onUpdate(task._id, { ...editData, version: task.version });
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description,
      assignedUser: task.assignedUser?._id || "",
      priority: task.priority,
    });
    setEditingTask(null);
  };

  useEffect(() => {
    if (!isEditing) {
      setEditData({
        title: task.title,
        description: task.description,
        assignedUser: task.assignedUser?._id || "",
        priority: task.priority,
      });
    }
  }, [task, isEditing]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? "0 10px 15px -3px rgba(0, 0, 0, 0.2)" : "none",
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-blue-400 rounded-xl p-4 shadow-md">
        <div className="space-y-3">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            placeholder="Task Title"
          />

          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-y"
            rows="2"
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            placeholder="Task Description"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={editData.assignedUser}
              onChange={(e) =>
                setEditData({ ...editData, assignedUser: e.target.value })
              }
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={editData.priority}
              onChange={(e) =>
                setEditData({ ...editData, priority: e.target.value })
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 group relative"
    >
      <div {...listeners} className="absolute top-2 left-2 cursor-grab">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      <div className="flex justify-between items-start mb-2 pl-6">
        <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition pr-3">
          {task.title}
        </h4>
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold border ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {task.assignedUser ? (
            <div className="flex items-center space-x-1 bg-blue-50 rounded-full pr-2 py-0.5">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-700">
                  {task.assignedUser.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-gray-700">
                {task.assignedUser.username}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-500 italic">Unassigned</span>
          )}
        </div>

        <div className="text-xs text-gray-500 font-mono">v{task.version}</div>
      </div>

      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onSmartAssign(task._id)}
          className="flex-1 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Smart
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex-1 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
