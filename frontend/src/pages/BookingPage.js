/* eslint-disable no-unused-vars */

import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

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

  const fetchRoom = useCallback(async () => {

    try {

      const res = await API.get("/api/rooms");

      const foundRoom = res.data.find(
        (r) => r._id === id
      );

      setRoom(foundRoom);

    } catch (error) {

      console.log(error);

    }

  }, [id]);

  useEffect(() => {

    fetchRoom();

  }, [fetchRoom]);

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

  const handlePayment = () => {

    if (
      !formData.checkInDate ||
      !formData.checkOutDate
    ) {

      alert("Please select dates");

      return;

    }

    const booking = {
      _id: Date.now(),
      room,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      totalPrice,
      status: "Paid"
    };

    const existingBookings =
      JSON.parse(
        localStorage.getItem("bookings")
      ) || [];

    localStorage.setItem(
      "bookings",
      JSON.stringify([
        ...existingBookings,
        booking
      ])
    );

    alert(
      `Payment Successful!\n\nTotal Amount: Rs. ${totalPrice}`
    );

    navigate("/customer-dashboard");

  };

  if (!room) {

    return (
      <h2
        style={{
          padding: "40px"
        }}
      >
        Loading...
      </h2>
    );

  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          width: "450px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.2)"
        }}
      >

        <h1
          style={{
            marginBottom: "20px",
            color: "#333"
          }}
        >
          Book Room {room.roomNumber}
        </h1>

        <img
          src={room.image}
          alt={room.roomNumber}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "20px"
          }}
        />

        <h2
          style={{
            color: "#764ba2"
          }}
        >
          Rs. {room.price}/night
        </h2>

        <div
          style={{
            marginTop: "25px"
          }}
        >

          <label>
            Check In Date
          </label>

          <input
            type="date"
            value={formData.checkInDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                checkInDate:
                  e.target.value
              })
            }
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              borderRadius: "10px",
              border:
                "1px solid #ccc"
            }}
          />

        </div>

        <div>

          <label>
            Check Out Date
          </label>

          <input
            type="date"
            value={formData.checkOutDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                checkOutDate:
                  e.target.value
              })
            }
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              borderRadius: "10px",
              border:
                "1px solid #ccc"
            }}
          />

        </div>

        <div>

          <label>
            Number Of Guests
          </label>

          <input
            type="number"
            min="1"
            value={formData.guests}
            onChange={(e) =>
              setFormData({
                ...formData,
                guests:
                  e.target.value
              })
            }
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              borderRadius: "10px",
              border:
                "1px solid #ccc"
            }}
          />

        </div>

        <h2
          style={{
            marginBottom: "10px",
            color: "#333"
          }}
        >
          Total Days:
          {" "}
          {calculateDays()}
        </h2>

        <h2
          style={{
            marginBottom: "25px",
            color: "#20b2aa"
          }}
        >
          Total Price:
          {" "}
          Rs. {totalPrice}
        </h2>

        <button
          onClick={handlePayment}
          style={{
            width: "100%",
            padding: "15px",
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Pay Now
        </button>

      </div>

    </div>

  );

}

export default BookingPage;