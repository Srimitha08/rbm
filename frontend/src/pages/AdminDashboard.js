import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/dashboard.css";

function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [userName, setUserName] = useState("Manager");
  const navigate = useNavigate();

  const fetchRooms = useCallback(async () => {
    try {
      setLoadingRooms(true);
      const res = await API.get("/api/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoadingBookings(true);
      const res = await API.get("/bookings/admin/all");
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const storedUserName = localStorage.getItem("userName");

    if (!token || role !== "ADMIN") {
      navigate("/manager-login");
      return;
    }

    if (storedUserName) setUserName(storedUserName);
    fetchRooms();
    fetchBookings();
  }, [navigate, fetchRooms, fetchBookings]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleToggleAvailability = async (room) => {
    try {
      await API.put(`/rooms/${room._id}`, {
        roomNumber: room.roomNumber,
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        amenities: room.amenities,
        description: room.description,
        image: room.image,
        available: !room.available
      });
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update room availability");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <div className="header-actions">
          <div className="user-info">{userName}</div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container admin-grid">
        <main className="admin-content">
          <section className="admin-panel">
            <h2>All Rooms ({rooms.length})</h2>
            {loadingRooms ? (
              <p>Loading rooms...</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Capacity</th>
                      <th>Available</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room._id}>
                        <td>{room.roomNumber}</td>
                        <td>{room.type}</td>
                        <td>Rs. {room.price}</td>
                        <td>{room.capacity}</td>
                        <td>{room.available ? "Yes" : "No"}</td>
                        <td>
                          <button
                            className="admin-action-btn"
                            onClick={() => handleToggleAvailability(room)}
                          >
                            {room.available ? "Mark Unavailable" : "Mark Available"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="admin-panel">
            <h2>All Bookings ({bookings.length})</h2>
            {loadingBookings ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table bookings-table">
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Guest Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Guests</th>
                      <th>Special Requests</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td><strong>{booking.room?.roomNumber || "N/A"}</strong></td>
                        <td>{booking.guestName}</td>
                        <td>{booking.guestEmail}</td>
                        <td>{booking.guestPhone}</td>
                        <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                        <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                        <td>{booking.numberOfGuests}</td>
                        <td>{booking.specialRequests || "—"}</td>
                        <td>Rs. {booking.totalPrice}</td>
                        <td><span className={`status-badge status-${booking.status.toLowerCase()}`}>{booking.status}</span></td>
                        <td>
                          {booking.status !== "Cancelled" && (
                            <button
                              className="admin-action-btn"
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
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
