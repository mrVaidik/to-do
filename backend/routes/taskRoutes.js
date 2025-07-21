const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");
const { logAction } = require("../utils/actionLogger");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate("assignedUser", "username")
      .populate("createdBy", "username")
      .populate("lastEditedBy", "username")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, assignedUser, priority } = req.body;

    const columnNames = ["Todo", "In Progress", "Done"];
    if (columnNames.includes(title)) {
      return res.status(400).json({
        message:
          "Task title cannot match Kanban column names (Todo, In Progress, Done)",
      });
    }

    const existingTask = await Task.findOne({ title });
    if (existingTask) {
      return res.status(400).json({ message: "Task title must be unique" });
    }

    const task = new Task({
      title,
      description,
      assignedUser: assignedUser || null,
      priority,
      createdBy: req.user._id,
      lastEditedBy: req.user._id,
    });

    await task.save();

    await task.populate(["assignedUser", "createdBy", "lastEditedBy"]);

    await logAction(
      req.user._id,
      "TASK_CREATED",
      task._id,
      `Created task: "${task.title}"`
    );

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error creating task" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, description, assignedUser, status, priority, version } =
      req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (version !== undefined && task.version !== version) {
      return res.status(409).json({
        message: "Conflict detected: Task has been updated by another user.",
        currentTask: await Task.findById(req.params.id)
          .populate("assignedUser", "username")
          .populate("createdBy", "username")
          .populate("lastEditedBy", "username"),
        attemptedUpdate: req.body,
        conflict: true,
      });
    }

    if (title !== undefined && title !== task.title) {
      const columnNames = ["Todo", "In Progress", "Done"];
      if (columnNames.includes(title)) {
        return res
          .status(400)
          .json({ message: "Task title cannot match Kanban column names" });
      }

      const existingTask = await Task.findOne({
        title,
        _id: { $ne: req.params.id }, // Exclude the current task itself
      });
      if (existingTask) {
        return res.status(400).json({ message: "Task title must be unique" });
      }
    }

    // Update fields if they are provided in the request body
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedUser !== undefined) task.assignedUser = assignedUser;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;

    task.lastEditedBy = req.user._id; // Record who last edited the task
    task.updatedAt = new Date(); // Update timestamp
    task.version += 1; // Increment version for next update

    await task.save();
    // Populate fields for the response and socket emission
    await task.populate(["assignedUser", "createdBy", "lastEditedBy"]);

    // Log the action and emit via Socket.IO
    await logAction(
      req.user._id,
      "TASK_UPDATED",
      task._id,
      `Updated task: "${task.title}"`
    );

    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error updating task" });
  }
});

// Delete a task
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Log the action and emit via Socket.IO
    await logAction(
      req.user._id,
      "TASK_DELETED",
      req.params.id, // Pass the ID as task is already deleted
      `Deleted task: "${task.title}"`
    );

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error deleting task" });
  }
});

// Smart assign task to the user with the fewest active tasks
router.post("/:id/smart-assign", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Get all users and their current active task counts
    const users = await User.find({});
    const userTaskCounts = await Promise.all(
      users.map(async (user) => {
        const count = await Task.countDocuments({
          assignedUser: user._id,
          status: { $in: ["Todo", "In Progress"] }, // Count only active tasks
        });
        return { user, count };
      })
    );

    // Find the user with the fewest active tasks
    const userWithFewestTasks = userTaskCounts.reduce((min, current) =>
      current.count < min.count ? current : min
    );

    // Assign the task to this user
    task.assignedUser = userWithFewestTasks.user._id;
    task.lastEditedBy = req.user._id; // Record who initiated the smart assign
    task.updatedAt = new Date();
    task.version += 1; // Increment version

    await task.save();
    // Populate fields for the response and socket emission
    await task.populate(["assignedUser", "createdBy", "lastEditedBy"]);

    // Log the action and emit via Socket.IO
    await logAction(
      req.user._id,
      "TASK_SMART_ASSIGNED",
      task._id,
      `Smart assigned task "${task.title}" to "${userWithFewestTasks.user.username}"`
    );

    res.json(task);
  } catch (error) {
    console.error("Smart assign error:", error);
    res.status(500).json({ message: "Server error during smart assignment" });
  }
});

module.exports = router;
