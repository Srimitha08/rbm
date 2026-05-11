const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// load environment variables
dotenv.config();

// import database connection
const connectDB = require("./config/db");
const User = require("./models/User");
const Room = require("./models/Room");

const sampleRooms = [
  {
    roomNumber: "101",
    type: "Single",
    price: 7500,
    capacity: 1,
    amenities: ["WiFi", "TV", "AC", "Private Bathroom"],
    description: "A cozy single room ideal for solo travelers.",
    available: true
  },
  {
    roomNumber: "102",
    type: "Double",
    price: 10500,
    capacity: 2,
    amenities: ["WiFi", "Queen Bed", "AC", "Private Bathroom"],
    description: "Comfortable double room with modern amenities.",
    available: true
  },
  {
    roomNumber: "201",
    type: "Deluxe",
    price: 15500,
    capacity: 2,
    amenities: ["WiFi", "King Bed", "Mini Bar", "Jacuzzi"],
    description: "Deluxe room with premium comforts and space.",
    available: true
  },
  {
    roomNumber: "202",
    type: "Suite",
    price: 24500,
    capacity: 4,
    amenities: ["WiFi", "King Bed", "Living Area", "Jacuzzi"],
    description: "A luxurious suite for families and special stays.",
    available: true
  },
  {
    roomNumber: "301",
    type: "Suite",
    price: 29500,
    capacity: 4,
    amenities: ["WiFi", "King Bed", "Spa", "Mini Bar"],
    description: "Premium suite with a large living space.",
    available: true
  }
];

// create express app
const app = express();

const seedRoomsIfEmpty = async () => {
  const roomCount = await Room.countDocuments();
  if (roomCount === 0) {
    await Room.insertMany(sampleRooms);
    console.log(`Seeded ${sampleRooms.length} sample rooms`);
  }
};

// connect to MongoDB and ensure admin user exists
const initializeServer = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@hotel.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Hotel Admin";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    existingAdmin.role = "ADMIN";
    existingAdmin.password = await bcrypt.hash(adminPassword, 10);
    await existingAdmin.save();
    console.log(`Updated existing user to ADMIN: ${adminEmail}`);
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN"
    });
    await admin.save();
    console.log(`Created admin user: ${adminEmail}`);
  }

  await seedRoomsIfEmpty();
};

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

initializeServer().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Server failed to start:", error);
});