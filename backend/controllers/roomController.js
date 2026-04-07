const Room = require("../models/Room");

// CREATE ROOM (ADMIN ONLY)
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, type, price, capacity, amenities, description, image } = req.body;

    // Validation
    if (!roomNumber || !type || !price || !capacity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: "Room number already exists" });
    }

    const room = new Room({
      roomNumber,
      type,
      price,
      capacity,
      amenities: amenities || [],
      description,
      image,
      available: true
    });

    await room.save();

    res.status(201).json({
      message: "Room created successfully",
      room
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ROOMS
exports.getRooms = async (req, res) => {
  try {
    const { type, available } = req.query;

    let filter = {};
    if (type) filter.type = type;
    if (available !== undefined) filter.available = available === "true";

    const rooms = await Room.find(filter);

    res.json(rooms);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ROOM BY ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ROOM (ADMIN ONLY)
exports.updateRoom = async (req, res) => {
  try {
    const { roomNumber, type, price, capacity, amenities, description, image, available } = req.body;

    const room = await Room.findByIdAndUpdate(
      req.params.roomId,
      {
        roomNumber,
        type,
        price,
        capacity,
        amenities,
        description,
        image,
        available
      },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({
      message: "Room updated successfully",
      room
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ROOM (ADMIN ONLY)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};