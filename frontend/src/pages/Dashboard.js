/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("browse");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [userName, setUserName] = useState("Guest");

  const navigate = useNavigate();

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);

      const params = roomType ? `?type=${roomType}` : "";

      const res = await API.get(`/api/rooms${params}`);

      setRooms(res.data);

    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  }, [roomType]);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await API.get("/api/bookings/my-bookings");

      setBookings(res.data);

    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token) {
      navigate("/");
      return;
    }

    if (role !== "USER") {
      navigate("/manager-login");
      return;
    }

    fetchRooms();
    fetchBookings();

    const storedUserName = localStorage.getItem("userName");

    if (storedUserName) {
      setUserName(storedUserName);
    }

  }, [navigate, fetchRooms, fetchBookings]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");

    navigate("/");
  };

  const filteredRooms = rooms.filter((room) => {

    const matchesSearch =
      room.roomNumber?.toString().includes(searchQuery) ||
      room.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "budget" && room.price <= 8000) ||
      (priceRange === "mid" &&
        room.price > 8000 &&
        room.price <= 18000) ||
      (priceRange === "luxury" && room.price > 18000);

    return matchesSearch && matchesPrice;
  });

  return (
    <div className="dashboard">

      <header className="dashboard-header">

        <h1>Luxury Hotel Booking</h1>

        <div className="header-actions">

          <div className="user-info">
            {userName}
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      <div className="dashboard-container">

        <nav className="dashboard-nav">

          <button
            className={`nav-btn ${
              view === "browse" ? "active" : ""
            }`}
            onClick={() => setView("browse")}
          >
            Browse Rooms
          </button>

          <button
            className={`nav-btn ${
              view === "bookings" ? "active" : ""
            }`}
            onClick={() => setView("bookings")}
          >
            My Bookings ({bookings.length})
          </button>

        </nav>

        <main className="dashboard-content">

          {view === "browse" && (
            <div className="browse-section">

              <h2>Find Your Perfect Room</h2>

              <div className="search-filter-section">

                <div className="filter-group">

                  <label>Search Rooms</label>

                  <input
                    type="text"
                    placeholder="Search by room number or type..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                  />

                </div>

                <div className="filter-group">

                  <label>Room Type</label>

                  <select
                    value={roomType}
                    onChange={(e) =>
                      setRoomType(e.target.value)
                    }
                  >
                    <option value="">All Types</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>

                </div>

                <div className="filter-group">

                  <label>Price Range</label>

                  <select
                    value={priceRange}
                    onChange={(e) =>
                      setPriceRange(e.target.value)
                    }
                  >
                    <option value="all">All Prices</option>
                    <option value="budget">
                      Budget (Rs. 0 - 8,000)
                    </option>
                    <option value="mid">
                      Mid-Range (Rs. 8,000 - 18,000)
                    </option>
                    <option value="luxury">
                      Luxury (Rs. 18,000+)
                    </option>
                  </select>

                </div>

              </div>

              {loading ? (

                <div className="empty-state">
                  <div className="empty-state-title">
                    Loading rooms...
                  </div>
                </div>

              ) : filteredRooms.length > 0 ? (

                <div className="rooms-grid">

                  {filteredRooms.map((room) => (

                    <div
                      key={room._id}
                      className="room-card"
                    >

                      <div className="room-card-image">

                        {room.image ? (
                          <img
                            src={room.image}
                            alt={room.roomNumber}
                          />
                        ) : (
                          <div className="room-placeholder">
                            Hotel
                          </div>
                        )}

                        <div className="room-badge">
                          {room.type}
                        </div>

                      </div>

                      <div className="room-info">

                        <h3>
                          Room {room.roomNumber}
                        </h3>

                        <div className="room-type">
                          {room.type}
                        </div>

                        <p className="room-price">
                          Rs. {room.price}
                          <span className="room-price-label">
                            /night
                          </span>
                        </p>

                        <p className="room-capacity">
                          Capacity: {room.capacity} guests
                        </p>

                        {room.amenities &&
                          room.amenities.length > 0 && (

                          <div className="amenities">

                            {room.amenities
                              .slice(0, 3)
                              .map((amenity, idx) => (

                                <span
                                  key={idx}
                                  className="amenity-tag"
                                >
                                  {amenity}
                                </span>

                              ))}

                          </div>
                        )}

                        {room.description && (
                          <p className="room-description">
                            {room.description}
                          </p>
                        )}

                        <button
                          className="book-btn"
                        >
                          Book Now
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="empty-state">

                  <div className="empty-state-title">
                    No rooms found
                  </div>

                  <div className="empty-state-text">
                    Try adjusting your search filters
                  </div>

                </div>

              )}

            </div>
          )}

          {view === "bookings" && (

            <div className="bookings-section">

              <h2>My Bookings</h2>

              {bookings.length > 0 ? (

                <div className="bookings-table">

                  <table>

                    <thead>
                      <tr>
                        <th>Room</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {bookings.map((booking) => (

                        <tr key={booking._id}>

                          <td>
                            {booking.room?.roomNumber}
                          </td>

                          <td>
                            {booking.room?.type}
                          </td>

                          <td>
                            {booking.status}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="empty-state">

                  <div className="empty-state-title">
                    No bookings yet
                  </div>

                </div>

              )}

            </div>

          )}

        </main>

      </div>

    </div>
  );
}

export default Dashboard;