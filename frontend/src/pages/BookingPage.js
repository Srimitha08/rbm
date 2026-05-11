/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function BookingPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [room, setRoom] = useState(null);

  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: 1
  });

  useEffect(() => {
    fetchRoom();
  }, []);

  const fetchRoom = async () => {
    try {

      const res = await API.get("/api/rooms");

      const foundRoom = res.data.find(
        (r) => r._id === id
      );

      setRoom(foundRoom);

    } catch (error) {
      console.log(error);
    }
  };

  const calculateDays = () => {

    if (
      formData.checkInDate &&
      formData.checkOutDate
    ) {

      const checkIn = new Date(
        formData.checkInDate
      );

      const checkOut = new Date(
        formData.checkOutDate
      );

      const diff =
        (checkOut - checkIn) /
        (1000 * 60 * 60 * 24);

      return diff > 0 ? diff : 0;
    }

    return 0;
  };

  const totalPrice =
    room && calculateDays() > 0
      ? room.price * calculateDays()
      : 0;

  const handlePayment = async () => {

    const booking = {
      _id: Date.now(),
      room,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      totalPrice,
      status: "Paid"
    };

    const existing =
      JSON.parse(
        localStorage.getItem("bookings")
      ) || [];

    localStorage.setItem(
      "bookings",
      JSON.stringify([...existing, booking])
    );

    alert("Payment Successful!");

    navigate("/customer-dashboard");
  };

  if (!room) return <h2>Loading...</h2>;

  return (
    <div className="booking-page">

      <h1>Book Room {room.roomNumber}</h1>

      <h2>Rs. {room.price}/night</h2>

      <div>

        <label>Check In Date</label>

        <input
          type="date"
          value={formData.checkInDate}
          onChange={(e) =>
            setFormData({
              ...formData,
              checkInDate: e.target.value
            })
          }
        />

      </div>

      <div>

        <label>Check Out Date</label>

        <input
          type="date"
          value={formData.checkOutDate}
          onChange={(e) =>
            setFormData({
              ...formData,
              checkOutDate: e.target.value
            })
          }
        />

      </div>

      <div>

        <label>Guests</label>

        <input
          type="number"
          min="1"
          value={formData.guests}
          onChange={(e) =>
            setFormData({
              ...formData,
              guests: e.target.value
            })
          }
        />

      </div>

      <h2>
        Total Days: {calculateDays()}
      </h2>

      <h2>
        Total Price: Rs. {totalPrice}
      </h2>

      <button onClick={handlePayment}>
        Pay Now
      </button>

    </div>
  );
}

export default BookingPage;