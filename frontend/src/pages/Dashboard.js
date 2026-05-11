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

  const [bookingForm, setBookingForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    specialRequests: ""
  });

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

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);

    setBookingForm({
      ...bookingForm,
      guestName: "",
      guestEmail: "",
      guestPhone: ""
    });

    setView("booking");
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;

    setBookingForm({
      ...bookingForm,
      [name]: value
    });
  };

  const validateBookingForm = () => {
    const {
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      numberOfGuests
    } = bookingForm;

    if (
      !guestName ||
      !guestEmail ||
      !guestPhone ||
      !checkInDate ||
      !checkOutDate
    ) {
      alert("Please fill in all required fields");
      return false;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date");
      return false;
    }

    if (numberOfGuests > selectedRoom.capacity) {
      alert(`Maximum capacity is ${selectedRoom.capacity} guests`);
      return false;
    }

    return true;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!validateBookingForm()) {
      return;
    }

    try {
      setLoading(true);

      await API.post("/api/bookings", {
        roomId: selectedRoom._id,
        guestName: bookingForm.guestName,
        guestEmail: bookingForm.guestEmail,
        guestPhone: bookingForm.guestPhone,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        numberOfGuests: parseInt(bookingForm.numberOfGuests),
        specialRequests: bookingForm.specialRequests
      });

      alert("Booking successful!");

      setSelectedRoom(null);

      setView("bookings");

      fetchBookings();
      fetchRooms();

    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this booking?"
      )
    ) {
      try {
        await API.put(`/api/bookings/${bookingId}/cancel`);

        alert("Booking cancelled successfully");

        fetchBookings();
        fetchRooms();

      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Failed to cancel booking"
        );
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    navigate("/");
  };

  const calculateNights = () => {
    if (
      bookingForm.checkInDate &&
      bookingForm.checkOutDate
    ) {
      const checkIn = new Date(bookingForm.checkInDate);
      const checkOut = new Date(bookingForm.checkOutDate);

      return Math.ceil(
        (checkOut - checkIn) / (1000 * 60 * 60 * 24)
      );
    }

    return 0;
  };

  const totalPrice =
    selectedRoom && calculateNights() > 0
      ? selectedRoom.price * calculateNights()
      : 0;

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.includes(searchQuery) ||
      room.type
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      room.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

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
            className={`nav-btn ${view === "browse" ? "active" : ""}`}
            onClick={() => {
              setView("browse");
              fetchRooms();
            }}
          >
            Browse Rooms
          </button>

          <button
            className={`nav-btn ${view === "bookings" ? "active" : ""}`}
            onClick={() => setView("bookings")}
          >
            My Bookings ({bookings.length})
          </button>

        </nav>

        <main className="dashboard-content">

          {view === "browse" && (
            <div className="browse-section">

              <h2>Find Your Perfect Room</h2>

              {loading ? (
                <p>Loading rooms...</p>
              ) : filteredRooms.length > 0 ? (

                <div className="rooms-grid">

                  {filteredRooms.map((room) => (
                    <div key={room._id} className="room-card">

                      <h3>Room {room.roomNumber}</h3>

                      <p>{room.type}</p>

                      <p>Rs. {room.price}</p>

                      <p>
                        Capacity: {room.capacity}
                      </p>

                      <button
                        className="book-btn"
                        onClick={() =>
                          handleSelectRoom(room)
                        }
                      >
                        Book Now
                      </button>

                    </div>
                  ))}

                </div>

              ) : (
                <p>No rooms found</p>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Dashboard;