const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  guestName: {
    type: String,
    required: true
  },

  guestEmail: {
    type: String,
    required: true
  },

  guestPhone: {
    type: String,
    required: true
  },

  checkInDate: {
    type: Date,
    required: true
  },

  checkOutDate: {
    type: Date,
    required: true
  },

  numberOfGuests: {
    type: Number,
    required: true
  },

  totalPrice: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending"
  },

  specialRequests: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);