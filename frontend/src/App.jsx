import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";
import TaskForm from "./components/TaskForm";
import KanbanBoard from "./components/KanbanBoard";
import ActivityLog from "./components/ActivityLog";
import ErrorAlert from "./components/ErrorAlert";
import LoadingSpinner from "./components/LoadingSpinner";
import ConflictModal from "./components/ConflictModal";
import dotenv from "dotenv";

const API_URL = import.meta.env.VITE_BACKEND;
let socket = null;

const App = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [actions, setActions] = useState([]);
  const [activeTab, setActiveTab] = useState("board");
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [conflictData, setConflictData] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
        initializeSocket(token);
        fetchData(token);
      } catch (e) {
        handleLogout();
      }
    }
  }, []);

  const initializeSocket = (token) => {
    if (socket) socket.disconnect();

    socket = io("http://localhost:5000", { auth: { token } });

    socket.on("connect", () => {
      setError("");
    });

    socket.on("connect_error", () => {
      setError("Connection lost. Attempting to reconnect...");
    });

    socket.on("taskCreated", (task) => {
      setTasks((prev) => [task, ...prev]);
    });

    socket.on("taskUpdated", (task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    socket.on("actionLogged", (action) => {
      setActions((prev) => [action, ...prev.slice(0, 19)]);
    });

    socket.on("disconnect", () => {
      setError("Disconnected. Reconnecting...");
    });
  };

  const fetchData = async (token) => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [tasksRes, usersRes, actionsRes] = await Promise.all([
        fetch(`${API_URL}/tasks`, { headers }),
        fetch(`${API_URL}/users`, { headers }),
        fetch(`${API_URL}/actions`, { headers }),
      ]);

      if (!tasksRes.ok || !usersRes.ok || !actionsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      setTasks(await tasksRes.json());
      setUsers(await usersRes.json());
      setActions(await actionsRes.json());
    } catch (err) {
      setError(`Data load failed: ${err.message || "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (formData, isLogin) => {
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        initializeSocket(data.token);
        fetchData(data.token);
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Network error during authentication");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTasks([]);
    setUsers([]);
    setActions([]);
    if (socket) socket.disconnect();
    setError("");
  };

  const handleCreateTask = async (taskData) => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          setConflictData(data);
        }
      }
    } catch (err) {
      setError(`Create failed: ${err.message}`);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          setConflictData(data);
        }
      }
      if (conflictData) setConflictData(null);
    } catch (err) {
      setError(`Update failed: ${err.message}`);
    } finally {
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError("");
    if (!window.confirm("Delete this task?")) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Delete failed");
      }
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
    }
  };

  const handleSmartAssign = async (taskId) => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/smart-assign`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Smart assign failed");
      }
    } catch (err) {
      setError(`Smart assign failed: ${err.message}`);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeTask = tasks.find((task) => task._id === activeId);
    if (!activeTask) return;

    let targetContainerId;
    if (over.data.current?.type === "container") {
      targetContainerId = over.id;
    } else if (over.data.current?.sortable?.containerId) {
      targetContainerId = over.data.current.sortable.containerId;
    } else {
      targetContainerId = over.id;
    }

    if (activeTask.status === targetContainerId) {
      const itemsInColumn = tasks.filter((t) => t.status === activeTask.status);
      const oldIndex = itemsInColumn.findIndex((task) => task._id === activeId);
      const newIndex = itemsInColumn.findIndex((task) => task._id === overId);

      if (oldIndex === newIndex) return;

      const newOrder = itemsInColumn
        .map((t) => t._id)
        .filter((id) => id !== activeId);
      newOrder.splice(newIndex, 0, activeId);

      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.status === activeTask.status) {
            return { ...task, order: newOrder.indexOf(task._id) };
          }
          return task;
        });
      });
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === activeId ? { ...t, status: targetContainerId } : t
        )
      );

      handleUpdateTask(activeTask._id, {
        status: targetContainerId,
        version: activeTask.version,
      });
    }
  };

  if (!user) {
    return (
      <AuthForm
        onSubmit={handleAuth}
        showLogin={showLoginForm}
        onToggleMode={() => setShowLoginForm(!showLoginForm)}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {error && <ErrorAlert message={error} onClose={() => setError("")} />}
        {loading && <LoadingSpinner />}

        {conflictData && (
          <ConflictModal
            conflictData={conflictData}
            onResolve={(resolution) => {
              if (resolution === "overwrite" && editingTask) {
                handleUpdateTask(conflictData.currentTask._id, {
                  ...editingTask,
                  version: conflictData.currentTask.version,
                  assignedUser: editingTask.assignedUser || null,
                });
              }
              setConflictData(null);
              setEditingTask(null);
            }}
            onCancel={() => {
              setConflictData(null);
              setEditingTask(null);
            }}
          />
        )}

        {activeTab === "board" ? (
          <div className="space-y-8">
            <TaskForm onSubmit={handleCreateTask} users={users} />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <KanbanBoard
                tasks={tasks}
                users={users}
                onEditTask={setEditingTask}
                onDeleteTask={handleDeleteTask}
                onSmartAssign={handleSmartAssign}
                onUpdateTask={handleUpdateTask}
                editingTask={editingTask}
                setEditingTask={setEditingTask}
              />
            </DndContext>
          </div>
        ) : (
          <ActivityLog actions={actions} />
        )}
      </div>
    </div>
  );
};

export default App;
