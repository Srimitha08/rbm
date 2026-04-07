const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// load environment variables
dotenv.config();

// import database connection
const connectDB = require("./config/db");

// create express app
const app = express();

// connect to MongoDB
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const authRoutes = require("./routes/authroutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

// test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Room Booking API Running"
  });
});

// handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});