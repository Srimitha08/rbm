const Booking = require("../models/Booking");
const Room = require("../models/Room");

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { roomId, guestName, guestEmail, guestPhone, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;
    const userId = req.user.id;

    // Validation
    if (!roomId || !guestName || !guestEmail || !guestPhone || !checkInDate || !checkOutDate || !numberOfGuests) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: "Check-out date must be after check-in date" });
    }

    // Check room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check room capacity
    if (numberOfGuests > room.capacity) {
      return res.status(400).json({ message: `Room capacity is ${room.capacity}` });
    }

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      room: roomId,
      status: { $ne: "Cancelled" },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Room already booked for this time period" });
    }

    // Calculate total price
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.price;

    // Create booking
    const booking = new Booking({
      room: roomId,
      user: userId,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      totalPrice,
      specialRequests: specialRequests || "",
      status: "Confirmed"
    });

    await booking.save();
    await booking.populate("room");

    res.status(201).json({
      message: "Booking successful",
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL BOOKINGS FOR A USER
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ user: userId })
      .populate("room")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BOOKING BY ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("room")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CANCEL BOOKING
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BOOKINGS BY ROOM (for checking availability)
exports.getBookingsByRoom = async (req, res) => {
  try {
    const bookings = await Booking.find({
      room: req.params.roomId,
      status: { $ne: "Cancelled" }
    }).select("checkInDate checkOutDate");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL BOOKINGS (ADMIN ONLY)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};