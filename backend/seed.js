const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Room = require("./models/Room");
const connectDB = require("./config/db");

const seedRooms = async () => {
  try {
    await connectDB();

    // Clear existing rooms
    await Room.deleteMany({});
    console.log("Cleared existing rooms");

    const rooms = [
      {
        roomNumber: "101",
        type: "Single",
        price: 7500,
        capacity: 1,
        amenities: ["WiFi", "Flat Screen TV", "Air Conditioning", "Private Bathroom"],
        description: "Cozy single room perfect for solo travelers. Equipped with modern amenities.",
        image: "https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=600&h=500&fit=crop&q=80",
        available: true
      },
      {
        roomNumber: "102",
        type: "Single",
        price: 7500,
        capacity: 1,
        amenities: ["WiFi", "Flat Screen TV", "Air Conditioning", "Private Bathroom"],
        description: "Comfortable single room with city view on upper floor.",
        image: "https://images.unsplash.com/photo-1641973814893-1fb8e38c7e0e?w=600&h=500&fit=crop&q=80",
        available: true
      },
      {
        roomNumber: "201",
        type: "Double",
        price: 10500,
        capacity: 2,
        amenities: ["WiFi", "Queen Bed", "Air Conditioning", "Private Bathroom", "Work Desk"],
        description: "Spacious double room with queen-size bed. Perfect for couples.",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&h=500&fit=crop&q=80",
        available: true
      },
      {
        roomNumber: "202",
        type: "Double",
        price: 10500,
        capacity: 2,
        amenities: ["WiFi", "Queen Bed", "Air Conditioning", "Private Bathroom", "Work Desk"],
        description: "Modern double room with scenic views and comfortable bedding.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=500&fit=crop&q=80",
        available: true
      },
      {
        roomNumber: "203",
        type: "Double",
        price: 10500,
        capacity: 2,
        amenities: ["WiFi", "Queen Bed", "Air Conditioning", "Private Bathroom", "Work Desk"],
        description: "Elegant double room with premium furnishings and ocean views.",
        image: "https://images.unsplash.com/photo-1602928924997-4b4cf3a5eca0?w=600&h=500&fit=crop&q=80",
        available: true
      },
      {
        roomNumber: "301",
        type: "Deluxe",
        price: 15500,
        capacity: 2,
        amenities: ["WiFi", "King Bed", "Air Conditioning", "Luxury Bathroom", "Mini Bar", "Bathrobe", "Work Desk", "Sofa"],
        description: "Luxurious deluxe room with premium amenities and spacious layout.",
        image: "https://images.unsplash.com/photo-1611432579699-484f7990f956?w=600&h=500&fit=crop&q=80",
        available: true
      },
      {
        roomNumber: "302",
        type: "Deluxe",
        price: 15500,
        capacity: 3,
        amenities: ["WiFi", "King Bed", "Air Conditioning", "Luxury Bathroom", "Mini Bar", "Bathrobe", "Work Desk", "Sofa", "Rain Shower"],
        description: "Premium deluxe room with separate living area and modern amenities.",
        image: "https://images.unsplash.com/photo-1512453426196-aed0c087f28f?w=600&h=500&fit=crop&q=80",
        available: true
      },
      {
        roomNumber: "401",
        type: "Suite",
        price: 24500,
        capacity: 4,
        amenities: ["WiFi", "King Bed", "Luxury Bathroom", "Jacuzzi", "Mini Bar", "Living Room", "Dining Area", "Work Desk", "Concierge Service", "Bath Amenities"],
        description: "Exclusive suite with separate bedroom and luxurious living space. Perfect for families.",
        image: "https://images.unsplash.com/photo-1590080876002-61a3e8f0a8a0?w=600&h=500&fit=crop&q=80",
        available: true
      },
      {
        roomNumber: "402",
        type: "Suite",
        price: 24500,
        capacity: 4,
        amenities: ["WiFi", "King Bed", "Luxury Bathroom", "Jacuzzi", "Mini Bar", "Living Room", "Dining Area", "Work Desk", "Concierge Service", "Private Balcony"],
        description: "Grand suite with panoramic views, separate living quarters, and premium services.",
        image: "https://images.unsplash.com/photo-1595576142108-4c89f0766e13?w=600&h=500&fit=crop&q=80",
        available: true
      },
      {
        roomNumber: "501",
        type: "Suite",
        price: 29500,
        capacity: 4,
        amenities: ["WiFi", "King Bed", "Luxury Bathroom", "Hot Tub", "Mini Bar", "Living Room", "Dining Area", "Work Desk", "Concierge Service", "Pillow Menu", "Sauna Access"],
        description: "Presidential suite with finest amenities, stunning views, and exclusive services.",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=500&fit=crop&q=80",
        available: true
      }
    ];

    const createdRooms = await Room.insertMany(rooms);
    console.log(`Successfully created ${createdRooms.length} rooms`);
    console.log("Room details:");
    createdRooms.forEach(room => {
      console.log(`  - Room ${room.roomNumber} (${room.type}): Rs. ${room.price}/night`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding rooms:", error);
    process.exit(1);
  }
};

seedRooms();
