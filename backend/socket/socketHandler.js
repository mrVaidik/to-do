const jwt = require("jsonwebtoken");
const User = require("../models/User");

const connectedUsers = new Map();

const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("authenticate", (token) => {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key"
        );
        connectedUsers.set(socket.id, decoded.userId);
        socket.join("board");
        console.log(
          `Socket ${socket.id} authenticated for user ${decoded.userId}`
        );
      } catch (error) {
        console.error("Socket authentication error:", error.message);
        socket.emit("authError", "Invalid authentication token");
        socket.disconnect(true);
      }
    });

    socket.on("taskEdit", async (data) => {
      const userId = connectedUsers.get(socket.id);
      if (userId) {
        try {
          const user = await User.findById(userId);
          if (user) {
            socket.to("board").emit("taskBeingEdited", {
              taskId: data.taskId,
              userId: userId,
              username: user.username,
              field: data.field,
            });
          }
        } catch (error) {
          console.error("Error fetching user for taskEdit event:", error);
        }
      }
    });

    socket.on("disconnect", () => {
      connectedUsers.delete(socket.id);
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = setupSocketIO;
