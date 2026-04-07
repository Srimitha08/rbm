const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const { 
  createRoom, 
  getRooms, 
  getRoomById,
  updateRoom, 
  deleteRoom 
} = require("../controllers/roomController");

// Public routes
router.get("/", getRooms);
router.get("/:roomId", getRoomById);

// Admin routes
router.post("/", protect, adminOnly, createRoom);
router.put("/:roomId", protect, adminOnly, updateRoom);
router.delete("/:roomId", protect, adminOnly, deleteRoom);

module.exports = router;