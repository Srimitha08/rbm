# Hotel Room Booking System

A full-stack web application for booking hotel rooms with user authentication, room browsing, and booking management.

## Features

### User Features
- **User Registration & Authentication**: Secure sign-up and login with JWT tokens
- **Browse Rooms**: View all available rooms with filters by room type
- **Room Details**: See room information including price, capacity, amenities, and descriptions
- **Book Rooms**: Easy-to-use booking form with date and guest information
- **Manage Bookings**: View all personal bookings and cancel them if needed
- **Booking Summary**: Calculate total price based on nights stayed

### Admin Features
- **Room Management**: Create, update, and delete rooms
- **View All Bookings**: See all bookings across all users
- **Booking Status**: Track booking status (Pending, Confirmed, Cancelled)

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React.js** for UI
- **React Router** for navigation
- **Axios** for API calls
- **CSS** for styling

## Project Structure

```
FS/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── roomController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Room.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authroutes.js
│   │   ├── bookingRoutes.js
│   │   └── roomRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Dashboard.js
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   ├── auth.css
    │   │   └── dashboard.css
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```
MONGO_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your_secret_key_here
PORT=5000
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Rooms
- `GET /api/rooms` - Get all rooms (with optional filters: ?type=Single)
- `GET /api/rooms/:roomId` - Get room details
- `POST /api/rooms` - Create room (Admin only)
- `PUT /api/rooms/:roomId` - Update room (Admin only)
- `DELETE /api/rooms/:roomId` - Delete room (Admin only)

### Bookings
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:bookingId/details` - Get booking details
- `PUT /api/bookings/:bookingId/cancel` - Cancel a booking
- `GET /api/bookings/availability/:roomId` - Check room availability
- `GET /api/bookings/admin/all` - Get all bookings (Admin only)

## Usage Guide

### For Users

1. **Register**: Click "Register here" on login page and create an account
2. **Login**: Enter your email and password to login
3. **Browse Rooms**: View available rooms on the dashboard
4. **Filter Rooms**: Select room type and apply filter
5. **Book a Room**: Click "Book Now" on a room card
6. **Fill Details**: Enter guest information, dates, and number of guests
7. **Confirm Booking**: Review total price and confirm
8. **Manage Bookings**: View and cancel bookings from "My Bookings" section

### For Admins

1. **Create Room**: Use room creation endpoint or admin panel
2. **Manage Rooms**: Update room details or delete rooms as needed
3. **View All Bookings**: Access admin panel to see all bookings

## Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: String (USER/ADMIN),
  createdAt: Date,
  updatedAt: Date
}
```

### Room
```javascript
{
  roomNumber: String (unique),
  type: String (Single/Double/Deluxe/Suite),
  price: Number,
  capacity: Number,
  amenities: [String],
  description: String,
  image: String,
  available: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```javascript
{
  room: ObjectId (ref: Room),
  user: ObjectId (ref: User),
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  totalPrice: Number,
  status: String (Pending/Confirmed/Cancelled),
  specialRequests: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes middleware
- Admin-only access for sensitive operations
- CORS enabled for frontend-backend communication

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check cloud connection string
- Verify `MONGO_URI` in `.env` file

### API Connection Error
- Check backend is running on correct port
- Verify API base URL in frontend `services/api.js`
- Check CORS settings in backend

### Authentication Issues
- Clear browser localStorage and login again
- Check JWT_SECRET is consistent in backend

## Future Enhancements

- Email notifications for bookings
- Payment integration
- Room ratings and reviews
- Advanced search and filtering
- Admin dashboard with charts and analytics
- Photo gallery for rooms
- Multi-language support
- Mobile app

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please contact the development team.
