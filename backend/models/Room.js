const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },

  type: {
    type: String,
    enum: ["Single", "Double", "Deluxe", "Suite"],
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  capacity: {
    type: Number,
    required: true
  },

  amenities: {
    type: [String],
    default: []
  },

  description: {
    type: String
  },

  image: {
    type: String
  },

  available: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);