# Quick Start Guide - Hotel Room Booking System

## Overview
This is a complete hotel room booking system with user authentication, room browsing, and booking management functionality.

## ✅ What's Ready to Use

All the code is complete and ready to run! The system includes:

### Backend Features
✅ User authentication (Register/Login)
✅ Room management 
✅ Booking management with availability checking
✅ Admin functionality
✅ Database models and validation
✅ Protected API routes

### Frontend Features
✅ Beautiful login/register pages
✅ Professional dashboard
✅ Room browsing with filters
✅ Booking form with date selection
✅ Booking history management
✅ Responsive design

## 🚀 Getting Started

### Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend folder:
```
MONGO_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your-secret-key-here
PORT=5000
```

Start the backend:
```bash
npm start
```

**Backend running on:** http://localhost:5000

### Step 2: Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm start
```

**Frontend running on:** http://localhost:3000

## 🧪 Testing the System

### 1. User Registration
- URL: http://localhost:3000/register
- Fill in: Name, Email, Password, Confirm Password
- Click Register
- You'll be redirected to login page

### 2. User Login
- URL: http://localhost:3000
- Use credentials from registration
- Click Login
- You'll be redirected to Dashboard

### 3. Browse Rooms
- On Dashboard, you should see available rooms
- Use the room type filter to narrow down
- Each room shows: type, price/night, capacity, amenities

### 4. Book a Room
- Click "Book Now" on any room
- Fill in guest details:
  - Guest Name
  - Guest Email
  - Guest Phone
  - Number of Guests
  - Check-in Date & Time
  - Check-out Date & Time
  - Special Requests (optional)
- Review the total price
- Click "Confirm Booking"

### 5. View Your Bookings
- Click "My Bookings" in the sidebar
- See all your bookings in a table
- View booking status and price
- Cancel bookings if needed

## 📊 Sample Data (Optional)

### To add sample rooms via API, use Postman:

**Create a Room (Admin):**
```
POST http://localhost:5000/api/rooms
Headers: Authorization: Bearer <admin-token>
Body:
{
  "roomNumber": "101",
  "type": "Deluxe",
  "price": 150,
  "capacity": 2,
  "amenities": ["WiFi", "Air Conditioning", "TV", "Mini Bar"],
  "description": "Beautiful deluxe room with city view",
  "image": "https://example.com/room1.jpg",
  "available": true
}
```

## 🔐 User Roles

### Regular User
- Can register and login
- Can browse and book rooms
- Can view and cancel their own bookings

### Admin User
- Can create, update, and delete rooms
- Can view all bookings in the system
- Create admin using database or API with role: "ADMIN"

## 📱 Key Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Rooms
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room (Admin)
- `PUT /api/rooms/:id` - Update room (Admin)
- `DELETE /api/rooms/:id` - Delete room (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id/details` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/availability/:roomId` - Check room availability
- `GET /api/bookings/admin/all` - Get all bookings (Admin)

## 🛑 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Make sure MongoDB is running (mongod)
- Check if MONGO_URI is correct in .env
- For MongoDB Atlas, use the correct connection string

### Issue: "CORS error"
**Solution:**
- Backend CORS is configured for localhost:3000
- Make sure frontend is running on correct port

### Issue: "Token invalid"
**Solution:**
- Clear browser localStorage (F12 → Application → LocalStorage)
- Login again

### Issue: "API not responding"
**Solution:**
- Check if backend is running (npm start in backend folder)
- Check console for errors
- Make sure port 5000 is not blocked

## 📁 File Structure

```
backend/
├── config/db.js          ← Database connection
├── models/               ← Data schemas
├── controllers/          ← Business logic
├── routes/               ← API endpoints
├── middleware/           ← Auth middleware
├── server.js            ← Express app
└── .env                 ← Environment variables

frontend/
├── src/
│   ├── pages/           ← React pages
│   ├── services/        ← API service
│   ├── styles/          ← CSS files
│   ├── App.js          ← Main component
│   └── index.js        ← Entry point
└── package.json        ← Dependencies
```

## 🎨 Styling

The project uses CSS with:
- Modern gradient colors
- Responsive grid layout
- Mobile-friendly design
- Smooth animations and transitions

## 📝 Notes

- All passwords are hashed with bcryptjs
- JWT tokens expire in 1 day
- Bookings check for room availability overlap
- Check-in must be before check-out
- Total price calculated automatically based on nights

## ✨ Features in Detail

### Room Availability Check
The system automatically prevents double bookings by checking if a room is already booked for the requested dates.

### Dynamic Price Calculator
As you select check-in and check-out dates, the system calculates the total price automatically.

### Responsive Dashboard
- Desktop: Multi-column grid
- Tablet: 2-column layout
- Mobile: Single column

### User Session Management
- Token stored in localStorage
- Auto-logout on token expiry
- Protected routes with authentication

## 🎯 Next Steps

1. Make sure both backend and frontend are running
2. Go to http://localhost:3000
3. Create an account
4. Start booking rooms!

## 💡 Tips

- Test with different browser windows for multiple users
- Try edge cases (same date, overlapping bookings)
- Check console for detailed error messages
- Use browser DevTools to inspect network requests

---

**Happy Booking! 🏨**
