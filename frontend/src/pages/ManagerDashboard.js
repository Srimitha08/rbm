import React, {
  useEffect,
  useState
} from "react";

import API from "../services/api";

function ManagerDashboard() {

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

  return (

    <div
      style={{
        padding: "40px"
      }}
    >

      <h1>
        Manager Dashboard
      </h1>

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
      />

      <button
        onClick={handleAddRoom}
      >
        Add Room
      </button>

      <hr />

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
            marginBottom: "20px"
          }}
        >

          <img
            src={
              room.image ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
            }
            alt={room.roomNumber}
            style={{
              width: "200px",
              height: "120px",
              objectFit: "cover"
            }}
          />

          <h3>
            Room {
              room.roomNumber
            }
          </h3>

          <p>
            {room.type}
          </p>

          <p>
            Rs. {room.price}
          </p>

          <button
            onClick={() =>
              handleDeleteRoom(
                room._id
              )
            }
          >
            Delete Room
          </button>

        </div>

      ))}

      <hr />

      <h2>
        All Bookings
      </h2>

      {bookings.map(
        (booking) => (

          <div
            key={booking._id}
            style={{
              border:
                "1px solid #ccc",
              padding: "20px",
              marginBottom: "20px"
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
      )}

    </div>

  );

}

export default ManagerDashboard;