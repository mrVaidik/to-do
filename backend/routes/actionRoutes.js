const express = require("express");
const ActionLog = require("../models/ActionLog");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const actions = await ActionLog.find({})
      .populate("user", "username")
      .sort({ timestamp: -1 })
      .limit(20); //
    res.json(actions);
  } catch (error) {
    console.error("Get actions error:", error);
    res.status(500).json({ message: "Server error fetching actions" });
  }
});

module.exports = router;
