# Hotel Room Booking Management System

## 1️⃣ Project Overview

A full-stack **Room Booking Management System** designed to enable users to book rooms and administrators to manage room availability. The system prevents booking conflicts by implementing strict overlap detection, ensures data persistence using MongoDB, and enforces role-based access control through JWT authentication.

### Key Features:
- ✅ User registration and login with JWT authentication
- ✅ Role-based access control (USER and ADMIN)
- ✅ Real-time room availability with dynamic booking
- ✅ **Critical: Overlap detection - prevents double bookings**
- ✅ Comprehensive booking management
- ✅ Admin room management dashboard
- ✅ Secure password hashing with bcryptjs
- ✅ Environment-based configuration
- ✅ Database persistence with MongoDB

---

## 2️⃣ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs
- **Environment:** dotenv
- **Port:** 5000

### Frontend
- **Framework:** React 19
- **Routing:** React Router v7
- **HTTP Client:** Axios with interceptors
- **Styling:** CSS3 with animations
- **Storage:** localStorage for tokens
- **Port:** 3000

### Database
- **Primary:** MongoDB
- **ORM:** Mongoose
- **Collections:** Users, Rooms, Bookings

---

## 3️⃣ User Roles & Permissions

### USER Role
| Permission | Status |
|-----------|--------|
| Register | ✅ |
| Login | ✅ |
| View available rooms | ✅ |
| Filter rooms by type/price | ✅ |
| Book a room | ✅ |
| View own bookings | ✅ |
| Cancel own bookings | ✅ |
| Access USER dashboard | ✅ |
| Create rooms | ❌ |
| Manage room inventory | ❌ |
| View all bookings | ❌ |

### ADMIN Role
| Permission | Status |
|-----------|--------|
| Register | ✅ |
| Login | ✅ |
| View available rooms | ✅ |
| Create new rooms | ✅ |
| Update room details | ✅ |
| Delete rooms | ✅ |
| Set room capacity | ✅ |
| View all bookings | ✅ |
| Monitor booking status | ✅ |
| Access ADMIN dashboard | ✅ |
| Book rooms | ✅ |
| Cancel bookings | ✅ |

---

## 4️⃣ Critical Business Rule: Overlap Detection

### The Problem
Multiple users must not be able to book the same room for overlapping time slots.

### Implementation Details
**Location:** `backend/controllers/bookingController.js` - `createBooking()` function

```javascript
// Check for overlapping bookings
const existingBooking = await Booking.findOne({
  room: roomId,
  status: { $ne: "Cancelled" },
  $or: [
    {
      checkInDate: { $lt: checkOut },  // Existing check-in before new check-out
      checkOutDate: { $gt: checkIn }   // Existing check-out after new check-in
    }
  ]
});

if (existingBooking) {
  return res.status(400).json({ message: "Room already booked for this time period" });
}
```

### How It Works
1. **Query Database:** Searches for any non-cancelled booking for the same room
2. **Overlap Logic:** Uses MongoDB `$or` operator to detect:
   - New booking starts before existing booking ends
   - New booking ends after existing booking starts
3. **Reject If Found:** Returns 400 error if overlap detected
4. **Allow If Clear:** Creates new booking only if no overlaps exist

### Example Scenarios
| Existing Booking | New Booking | Result |
|-----------------|------------|--------|
| Jan 1-5 | Jan 1-5 | ❌ REJECTED (exact overlap) |
| Jan 1-5 | Jan 3-7 | ❌ REJECTED (partial overlap) |
| Jan 1-5 | Jan 5-10 | ✅ ALLOWED (same checkout/check-in) |
| Jan 1-5 | Jan 6-10 | ✅ ALLOWED (no overlap) |
| Jan 1-5 (Cancelled) | Jan 1-5 | ✅ ALLOWED (cancelled booking ignored) |

---

## 5️⃣ API Endpoints

### Authentication Endpoints
**Base URL:** `http://localhost:5000/api/auth`

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123",
  "role": "USER"  // or "ADMIN"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Room Management Endpoints
**Base URL:** `http://localhost:5000/api/rooms`

#### Get All Rooms
```
GET /rooms
Query Params:
  - type: "Single" | "Double" | "Deluxe" | "Suite" (optional)
  - available: "true" | "false" (optional)

Response: 200 OK
[
  {
    "_id": "...",
    "roomNumber": "101",
    "type": "Single",
    "price": 7500,
    "capacity": 1,
    "amenities": ["WiFi", "Flat Screen TV", "Air Conditioning"],
    "description": "Cozy single room...",
    "image": "https://...",
    "available": true
  }
]
```

#### Get Room by ID
```
GET /rooms/:roomId

Response: 200 OK
{
  "_id": "...",
  "roomNumber": "101",
  "type": "Single",
  "price": 7500,
  "capacity": 1,
  "amenities": ["WiFi", "Flat Screen TV"],
  "description": "...",
  "image": "...",
  "available": true
}
```

#### Create Room (ADMIN ONLY)
```
POST /rooms
Authorization: Bearer {token}
Content-Type: application/json

{
  "roomNumber": "101",
  "type": "Single",
  "price": 7500,
  "capacity": 1,
  "amenities": ["WiFi", "Flat Screen TV", "Air Conditioning"],
  "description": "Cozy single room...",
  "image": "https://..."
}

Response: 201 Created
{
  "message": "Room created successfully",
  "room": { ... }
}
```

#### Update Room (ADMIN ONLY)
```
PUT /rooms/:roomId
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 8000,
  "available": false
}

Response: 200 OK
{
  "message": "Room updated successfully",
  "room": { ... }
}
```

#### Delete Room (ADMIN ONLY)
```
DELETE /rooms/:roomId
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Room deleted successfully"
}
```

---

### Booking Endpoints
**Base URL:** `http://localhost:5000/api/bookings`

#### Create Booking (User)
```
POST /bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "roomId": "...",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "9876543210",
  "checkInDate": "2024-04-15T14:00:00Z",
  "checkOutDate": "2024-04-17T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": "High floor preferred"
}

Response: 201 Created
{
  "message": "Booking successful",
  "booking": {
    "_id": "...",
    "room": { ... },
    "user": "...",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "9876543210",
    "checkInDate": "2024-04-15T14:00:00Z",
    "checkOutDate": "2024-04-17T11:00:00Z",
    "numberOfGuests": 1,
    "totalPrice": 15000,
    "specialRequests": "High floor preferred",
    "status": "Confirmed"
  }
}
```

**Error Response (Overlap Detected):**
```
Response: 400 Bad Request
{
  "message": "Room already booked for this time period"
}
```

#### Get My Bookings (User)
```
GET /bookings/my-bookings
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "...",
    "room": { ... },
    "guestName": "John Doe",
    "checkInDate": "2024-04-15T14:00:00Z",
    "checkOutDate": "2024-04-17T11:00:00Z",
    "totalPrice": 15000,
    "status": "Confirmed"
  }
]
```

#### Get Booking Details
```
GET /bookings/:bookingId/details
Authorization: Bearer {token}

Response: 200 OK
{
  "_id": "...",
  "room": { ... },
  "user": { ... },
  "guestName": "John Doe",
  "checkInDate": "2024-04-15T14:00:00Z",
  "checkOutDate": "2024-04-17T11:00:00Z",
  "numberOfGuests": 1,
  "totalPrice": 15000,
  "specialRequests": "High floor preferred",
  "status": "Confirmed"
}
```

#### Cancel Booking
```
PUT /bookings/:bookingId/cancel
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Booking cancelled successfully",
  "booking": { ... with status: "Cancelled" }
}
```

#### Get Room Availability
```
GET /bookings/availability/:roomId

Response: 200 OK
[
  {
    "checkInDate": "2024-04-15T14:00:00Z",
    "checkOutDate": "2024-04-17T11:00:00Z"
  }
]
```

#### Get All Bookings (ADMIN ONLY)
```
GET /bookings/admin/all
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "...",
    "room": { ... },
    "user": { ... },
    "guestName": "John Doe",
    "checkInDate": "2024-04-15T14:00:00Z",
    "checkOutDate": "2024-04-17T11:00:00Z",
    "totalPrice": 15000,
    "status": "Confirmed"
  }
]
```

---

## 6️⃣ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcryptjs),
  phone: String (optional),
  address: String (optional),
  role: String (enum: ["USER", "ADMIN"], default: "USER"),
  createdAt: Date,
  updatedAt: Date
}
```

### Room Collection
```javascript
{
  _id: ObjectId,
  roomNumber: String (required, unique),
  type: String (enum: ["Single", "Double", "Deluxe", "Suite"], required),
  price: Number (required, in INR),
  capacity: Number (required),
  amenities: [String] (default: []),
  description: String (optional),
  image: String (optional),
  available: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Collection
```javascript
{
  _id: ObjectId,
  room: ObjectId (ref: "Room", required),
  user: ObjectId (ref: "User", required),
  guestName: String (required),
  guestEmail: String (required),
  guestPhone: String (required),
  checkInDate: Date (required),
  checkOutDate: Date (required),
  numberOfGuests: Number (required),
  totalPrice: Number (required, calculated),
  specialRequests: String (optional),
  status: String (enum: ["Confirmed", "Cancelled"], default: "Confirmed"),
  createdAt: Date,
  updatedAt: Date
}

// Indexes for overlap detection:
// - { room: 1, status: 1 }
// - { room: 1, checkInDate: 1, checkOutDate: 1 }
```

---

## 7️⃣ Frontend Features

### User Features
- ✅ **Register/Login Pages:** Clean authentication interface
- ✅ **Dashboard:** Browse and book available rooms
- ✅ **Search & Filter:** Search by room number, filter by type/price
- ✅ **Booking Form:** Detailed booking with guest information
- ✅ **Booking History:** View all personal bookings with status
- ✅ **Booking Cancellation:** Cancel bookings with confirmation

### Admin Features
- ✅ **Admin Dashboard:** View all active bookings
- ✅ **Room Management:** Create, update, delete rooms
- ✅ **Booking Overview:** Monitor all bookings with timestamps
- ✅ **Real-time Updates:** See immediate changes after room/booking updates

### UI/UX
- Modern gradient-based design
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Error handling with user-friendly messages
- Loading states with visual feedback
- Sticky navigation headers

---

## 8️⃣ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas connection)
- npm or yarn

### Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** with:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel_booking
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. **Seed sample data**
   ```bash
   node seed.js
   ```

5. **Start backend server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start frontend server**
   ```bash
   npm start
   ```
   Application opens on `http://localhost:3000`

---

## 9️⃣ Testing the System

### Test User Credentials
```
Email: test@example.com
Password: test123
Role: USER
```

### Test Admin Credentials
```
Email: admin@example.com
Password: admin123
Role: ADMIN
```

### Test Overlap Detection
1. Login as USER
2. Book Room 101 from Apr 15-17
3. Try to book same room for:
   - Apr 15-17 → **Should be REJECTED** ❌
   - Apr 14-16 → **Should be REJECTED** ❌
   - Apr 17-19 → **Should be ALLOWED** ✅
   - Apr 12-14 → **Should be ALLOWED** ✅

### Test Role-Based Access
1. Try accessing `/bookings/admin/all` without admin token → **403 Forbidden**
2. Try creating room as USER without admin role → **403 Forbidden**
3. Try accessing admin endpoints with valid admin token → **200 OK**

---

## 🔟 Deployment

### Backend Deployment (Render/Heroku)
1. Push code to GitHub
2. Connect repository to Render/Heroku
3. Set environment variables
4. Deploy

**Live Backend Link:** _(To be added by user)_

### Frontend Deployment (Vercel/Netlify)
1. Build frontend: `npm run build`
2. Deploy to Vercel/Netlify
3. Update API endpoint in `frontend/src/services/api.js`

**Live Frontend Link:** _(To be added by user)_

---

## 1️⃣1️⃣ Key Implementation Highlights

### Security Features
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token-based authentication (24-hour expiration)
- ✅ Role-based access control on all sensitive endpoints
- ✅ Authorization checks on booking cancellation (users can only cancel own bookings)
- ✅ Environment variables for sensitive config

### Data Validation
- ✅ Required field validation on all POST/PUT requests
- ✅ Check-out date must be after check-in date
- ✅ Guest count cannot exceed room capacity
- ✅ Room number uniqueness enforcement
- ✅ Email uniqueness enforcement for users

### Conflict Prevention
- ✅ **Overlap detection:** Prevents double-booking of rooms
- ✅ **Status filtering:** Only non-cancelled bookings are considered
- ✅ **Atomic operations:** Database transactions ensure consistency
- ✅ **Real-time availability:** Fetched from database on each booking

---

## 1️⃣2️⃣ File Structure

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
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authroutes.js
│   │   ├── bookingRoutes.js
│   │   └── roomRoutes.js
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── seed.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

---

## 1️⃣3️⃣ Troubleshooting

### "Room already booked for this time period"
- The overlap detection is working correctly
- Try booking a different date range or a different room
- Cancelled bookings don't block availability

### "Admin access only"
- Your account doesn't have admin role
- Contact system administrator or create new admin account
- Admin creation requires setting `role: "ADMIN"` during registration

### "Invalid token"
- Token has expired (valid for 24 hours)
- Please login again to get a new token
- Token is stored in localStorage

### MongoDB Connection Error
- Verify MONGO_URI in .env file
- Check MongoDB server is running
- Ensure IP whitelist includes your current IP (for MongoDB Atlas)

---

## 1️⃣4️⃣ Contact & Support

For any issues or questions regarding this system:
- Check the API documentation above
- Review database schema for structure
- Test overlap detection scenarios
- Verify JWT token is included in Authorization header

---

**Last Updated:** April 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
