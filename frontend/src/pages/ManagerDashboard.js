import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import API from "../services/api";

function ManagerDashboard() {

  const navigate = useNavigate();

  const [rooms, setRooms] =
    useState([]);

  const [bookings, setBookings] =
    useState([]);

  const [newRoom, setNewRoom] =
    useState({
      roomNumber: "",
      type: "",
      price: "",
      capacity: "",
      image: ""
    });

  useEffect(() => {

    fetchRooms();

    fetchBookings();

  }, []);

  const fetchRooms = async () => {

    try {

      const res =
        await API.get("/api/rooms");

      setRooms(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchBookings = () => {

    const storedBookings =
      JSON.parse(
        localStorage.getItem("bookings")
      ) || [];

    setBookings(storedBookings);

  };

  const handleDeleteRoom = (
    roomId
  ) => {

    const updatedRooms =
      rooms.filter(
        (room) =>
          room._id !== roomId
      );

    setRooms(updatedRooms);

    alert("Room deleted");

  };

  const handleAddRoom = () => {

    const room = {
      _id: Date.now(),
      ...newRoom,
      amenities: [
        "WiFi",
        "AC"
      ],
      description:
        "Luxury room"
    };

    setRooms([
      ...rooms,
      room
    ]);

    setNewRoom({
      roomNumber: "",
      type: "",
      price: "",
      capacity: "",
      image: ""
    });

    alert("Room added");

  };

  const handleLogout = () => {

    localStorage.removeItem(
      "manager"
    );

    navigate("/");

  };

  return (

    <div
      style={{
        padding: "40px"
      }}
    >

      <h1>
        Manager Dashboard
      </h1>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          marginBottom: "30px",
          background: "#764ba2",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

      <h2>
        Add Room
      </h2>

      <input
        placeholder="Room Number"
        value={newRoom.roomNumber}
        onChange={(e) =>
          setNewRoom({
            ...newRoom,
            roomNumber:
              e.target.value
          })
        }
        style={{
          margin: "10px",
          padding: "10px"
        }}
      />

      <input
        placeholder="Type"
        value={newRoom.type}
        onChange={(e) =>
          setNewRoom({
            ...newRoom,
            type:
              e.target.value
          })
        }
        style={{
          margin: "10px",
          padding: "10px"
        }}
      />

      <input
        placeholder="Price"
        value={newRoom.price}
        onChange={(e) =>
          setNewRoom({
            ...newRoom,
            price:
              e.target.value
          })
        }
        style={{
          margin: "10px",
          padding: "10px"
        }}
      />

      <input
        placeholder="Capacity"
        value={newRoom.capacity}
        onChange={(e) =>
          setNewRoom({
            ...newRoom,
            capacity:
              e.target.value
          })
        }
        style={{
          margin: "10px",
          padding: "10px"
        }}
      />

      <input
        placeholder="Image URL"
        value={newRoom.image}
        onChange={(e) =>
          setNewRoom({
            ...newRoom,
            image:
              e.target.value
          })
        }
        style={{
          margin: "10px",
          padding: "10px",
          width: "300px"
        }}
      />

      <button
        onClick={handleAddRoom}
        style={{
          padding: "10px 20px",
          background: "#20b2aa",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Add Room
      </button>

      <hr
        style={{
          margin: "40px 0"
        }}
      />

      <h2>
        All Rooms
      </h2>

      {rooms.map((room) => (

        <div
          key={room._id}
          style={{
            border:
              "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px"
          }}
        >

          <img
            src={
              room.image ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
            }
            alt={room.roomNumber}
            style={{
              width: "250px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "10px"
            }}
          />

          <h3>
            Room {
              room.roomNumber
            }
          </h3>

          <p>
            Type:
            {" "}
            {room.type}
          </p>

          <p>
            Price:
            {" "}
            Rs. {room.price}
          </p>

          <p>
            Capacity:
            {" "}
            {room.capacity}
          </p>

          <button
            onClick={() =>
              handleDeleteRoom(
                room._id
              )
            }
            style={{
              padding: "10px 20px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Delete Room
          </button>

        </div>

      ))}

      <hr
        style={{
          margin: "40px 0"
        }}
      />

      <h2>
        All Bookings
      </h2>

      {bookings.length > 0 ? (

        bookings.map(
          (booking) => (

            <div
              key={booking._id}
              style={{
                border:
                  "1px solid #ccc",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px"
              }}
            >

              <h3>
                Room {
                  booking.room
                    ?.roomNumber
                }
              </h3>

              <p>
                Check In:
                {" "}
                {
                  booking.checkInDate
                }
              </p>

              <p>
                Check Out:
                {" "}
                {
                  booking.checkOutDate
                }
              </p>

              <p>
                Amount:
                {" "}
                Rs.
                {
                  booking.totalPrice
                }
              </p>

              <p>
                Status:
                {" "}
                Paid
              </p>

            </div>

          )
        )

      ) : (

        <h3>
          No bookings yet
        </h3>

      )}

    </div>

  );

}

export default ManagerDashboard;