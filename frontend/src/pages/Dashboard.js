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
      const res = await API.get(`/rooms${params}`);
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
    if (storedUserName) setUserName(storedUserName);
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
    const { guestName, guestEmail, guestPhone, checkInDate, checkOutDate, numberOfGuests } = bookingForm;

    if (!guestName || !guestEmail || !guestPhone || !checkInDate || !checkOutDate) {
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
      await API.post("/bookings", {
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
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await API.put(`/bookings/${bookingId}/cancel`);
        alert("Booking cancelled successfully");
        fetchBookings();
        fetchRooms();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to cancel booking");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const calculateNights = () => {
    if (bookingForm.checkInDate && bookingForm.checkOutDate) {
      const checkIn = new Date(bookingForm.checkInDate);
      const checkOut = new Date(bookingForm.checkOutDate);
      return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const totalPrice = selectedRoom && calculateNights() > 0 ? selectedRoom.price * calculateNights() : 0;

  // Filter rooms based on search and price
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.includes(searchQuery) || 
                         room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = priceRange === "all" ||
                        (priceRange === "budget" && room.price <= 100) ||
                        (priceRange === "mid" && room.price > 100 && room.price <= 200) ||
                        (priceRange === "luxury" && room.price > 200);
    
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
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar Navigation */}
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
          <button
            className={`nav-btn`}
            onClick={() => {
              alert("New features coming soon!");
            }}
          >
            Favorites
          </button>
          <button
            className={`nav-btn`}
            onClick={() => {
              alert("Contact support at support@hotel.com");
            }}
          >
            Support
          </button>
        </nav>

        {/* Main Content */}
        <main className="dashboard-content">
          {/* Browse Rooms View */}
          {view === "browse" && (
            <div className="browse-section">
              <h2>Find Your Perfect Room</h2>

              <div className="search-filter-section">
                <div className="filter-group">
                  <label htmlFor="search">Search Rooms</label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by room number or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="roomType">Room Type</label>
                  <select
                    id="roomType"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="priceRange">Price Range</label>
                  <select
                    id="priceRange"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    <option value="budget">Budget (Rs. 0 - 8,000)</option>
                    <option value="mid">Mid-Range (Rs. 8,000 - 18,000)</option>
                    <option value="luxury">Luxury (Rs. 18,000+)</option>
                  </select>
                </div>

                <button onClick={fetchRooms} className="search-btn">
                  Search
                </button>
              </div>

              {loading ? (
                <div className="empty-state">
                  <div className="empty-state-icon">Loading...</div>
                  <div className="empty-state-title">Loading rooms...</div>
                </div>
              ) : filteredRooms.length > 0 ? (
                <div className="rooms-grid">
                  {filteredRooms.map((room) => (
                    <div key={room._id} className="room-card">
                      <div className="room-card-image">
                        {room.image ? (
                          <img src={room.image} alt={room.roomNumber} />
                        ) : (
                          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '40px' }}>
                            Hotel
                          </div>
                        )}
                        <div className="room-badge">{room.type}</div>
                      </div>
                      <div className="room-info">
                        <h3>Room {room.roomNumber}</h3>
                        <div className="room-type">{room.type}</div>
                        <p className="room-price">
                          Rs. {room.price}<span className="room-price-label">/night</span>
                        </p>
                        <p className="room-capacity">Capacity: {room.capacity} guests</p>
                        
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="amenities">
                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="amenity-tag"> {amenity}</span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span className="amenity-tag">+{room.amenities.length - 3} more</span>
                            )}
                          </div>
                        )}

                        {room.description && (
                          <p className="room-description">"{room.description}"</p>
                        )}

                        <button
                          className="book-btn"
                          onClick={() => handleSelectRoom(room)}
                          disabled={!room.available}
                        >
                          {room.available ? "Book Now" : "Unavailable"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">Search</div>
                  <div className="empty-state-title">No rooms found</div>
                  <div className="empty-state-text">Try adjusting your search filters</div>
                </div>
              )}
            </div>
          )}

          {/* Booking Form View */}
          {view === "booking" && selectedRoom && (
            <div className="booking-section">
              <h2>Book Room {selectedRoom.roomNumber}</h2>
              <form onSubmit={handleSubmitBooking} className="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="guestName">Guest Name *</label>
                    <input
                      id="guestName"
                      type="text"
                      name="guestName"
                      value={bookingForm.guestName}
                      onChange={handleBookingChange}
                      placeholder="Full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="guestEmail">Email Address *</label>
                    <input
                      id="guestEmail"
                      type="email"
                      name="guestEmail"
                      value={bookingForm.guestEmail}
                      onChange={handleBookingChange}
                      placeholder="Email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="guestPhone">Phone Number *</label>
                    <input
                      id="guestPhone"
                      type="tel"
                      name="guestPhone"
                      value={bookingForm.guestPhone}
                      onChange={handleBookingChange}
                      placeholder="Phone number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="numberOfGuests">Number of Guests *</label>
                    <input
                      id="numberOfGuests"
                      type="number"
                      name="numberOfGuests"
                      value={bookingForm.numberOfGuests}
                      onChange={handleBookingChange}
                      min="1"
                      max={selectedRoom.capacity}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="checkInDate">Check-in Date & Time *</label>
                    <input
                      id="checkInDate"
                      type="datetime-local"
                      name="checkInDate"
                      value={bookingForm.checkInDate}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="checkOutDate">Check-out Date & Time *</label>
                    <input
                      id="checkOutDate"
                      type="datetime-local"
                      name="checkOutDate"
                      value={bookingForm.checkOutDate}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="specialRequests">Special Requests</label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={bookingForm.specialRequests}
                    onChange={handleBookingChange}
                    placeholder="Any special requests? (e.g., high floor, extra pillows, early check-in)"
                    rows="3"
                  />
                </div>

                <div className="booking-summary">
                  <h3>Booking Summary</h3>
                  <p><strong>Room Type:</strong> {selectedRoom.type}</p>
                  <p><strong>Room Number:</strong> {selectedRoom.roomNumber}</p>
                  <p><strong>Price per Night:</strong> Rs. {selectedRoom.price}</p>
                  <p><strong>Number of Nights:</strong> {calculateNights()}</p>
                  {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                    <p><strong>Amenities:</strong> {selectedRoom.amenities.join(", ")}</p>
                  )}
                  <p className="total-price"><strong>Total Price:</strong> Rs. {totalPrice}</p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Processing..." : "Confirm Booking"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setView("browse")}
                    disabled={loading}
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* My Bookings View */}
          {view === "bookings" && (
            <div className="bookings-section">
              <h2>My Bookings</h2>

              {bookings.length > 0 ? (
                <div className="bookings-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Room #</th>
                        <th>Type</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td><strong>{booking.room.roomNumber}</strong></td>
                          <td>{booking.room.type}</td>
                          <td>{new Date(booking.checkInDate).toLocaleString()}</td>
                          <td>{new Date(booking.checkOutDate).toLocaleString()}</td>
                          <td className={`status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </td>
                          <td><strong>Rs. {booking.totalPrice}</strong></td>
                          <td>
                            {booking.status !== "Cancelled" && (
                              <button
                                className="cancel-booking-btn"
                                onClick={() => handleCancelBooking(booking._id)}
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">Bookings</div>
                  <div className="empty-state-title">No bookings yet</div>
                  <div className="empty-state-text">
                    You haven't made any bookings yet.{" "}
                    <button onClick={() => setView("browse")} className="link-button">
                      Browse rooms now
                    </button>
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