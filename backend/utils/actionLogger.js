const ActionLog = require("../models/ActionLog");
const User = require("../models/User");

let socketIoInstance;

const initializeActionLogger = (ioInstance) => {
  socketIoInstance = ioInstance;
};

const logAction = async (userId, action, taskId = null, details = "") => {
  try {
    const actionLog = new ActionLog({
      user: userId,
      action,
      taskId,
      details,
    });
    await actionLog.save();

    const populatedLog = await ActionLog.findById(actionLog._id).populate(
      "user",
      "username"
    );

    if (socketIoInstance) {
      socketIoInstance.emit("actionLogged", populatedLog);
    } else {
      console.warn("Socket.IO instance not initialized for action logger.");
    }
  } catch (error) {
    console.error("Error logging action:", error);
  }
};

module.exports = { logAction, initializeActionLogger };
