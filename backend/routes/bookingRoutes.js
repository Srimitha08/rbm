const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getBookingsByRoom,
  getAllBookings
} = require("../controllers/bookingController");

// User routes
router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getUserBookings);
router.get("/:bookingId/details", protect, getBookingById);
router.put("/:bookingId/cancel", protect, cancelBooking);

// Room availability check
router.get("/availability/:roomId", getBookingsByRoom);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllBookings);

module.exports = router;