# API Documentation - Hotel Booking System

Complete API reference for the Hotel Room Booking System backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### Register User
```
POST /auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Login User
```
POST /auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🏨 Room Endpoints

### Get All Rooms
```
GET /rooms
```
**Query Parameters:**
- `type` (optional): Filter by room type (Single, Double, Deluxe, Suite)
- `available` (optional): Filter by availability (true/false)

**Example:**
```
GET /rooms?type=Deluxe&available=true
```

**Response (200):**
```json
[
  {
    "_id": "...",
    "roomNumber": "101",
    "type": "Deluxe",
    "price": 150,
    "capacity": 2,
    "amenities": ["WiFi", "AC", "TV"],
    "description": "Beautiful deluxe room",
    "image": "...",
    "available": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Single Room
```
GET /rooms/:roomId
```
**Response (200):** Returns single room object

### Create Room (Admin Only)
```
POST /rooms
Authorization: Bearer <admin-token>
```
**Body:**
```json
{
  "roomNumber": "102",
  "type": "Suite",
  "price": 200,
  "capacity": 4,
  "amenities": ["WiFi", "AC", "TV", "Jacuzzi"],
  "description": "Luxury suite with mountain view",
  "image": "https://example.com/image.jpg",
  "available": true
}
```
**Response (201):** Returns created room object

### Update Room (Admin Only)
```
PUT /rooms/:roomId
Authorization: Bearer <admin-token>
```
**Body:** Any fields to update (same as create)

**Response (200):**
```json
{
  "message": "Room updated successfully",
  "room": { ... }
}
```

### Delete Room (Admin Only)
```
DELETE /rooms/:roomId
Authorization: Bearer <admin-token>
```
**Response (200):**
```json
{
  "message": "Room deleted successfully"
}
```

---

## 📅 Booking Endpoints

### Create Booking
```
POST /bookings
Authorization: Bearer <user-token>
```
**Body:**
```json
{
  "roomId": "...",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890",
  "checkInDate": "2024-02-01T15:00:00Z",
  "checkOutDate": "2024-02-05T11:00:00Z",
  "numberOfGuests": 2,
  "specialRequests": "High floor preference"
}
```
**Response (201):**
```json
{
  "message": "Booking successful",
  "booking": {
    "_id": "...",
    "room": { ... },
    "user": "...",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+1234567890",
    "checkInDate": "2024-02-01T15:00:00Z",
    "checkOutDate": "2024-02-05T11:00:00Z",
    "numberOfGuests": 2,
    "totalPrice": 600,
    "status": "Confirmed",
    "specialRequests": "High floor preference",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get User's Bookings
```
GET /bookings/my-bookings
Authorization: Bearer <user-token>
```
**Response (200):**
```json
[
  {
    "_id": "...",
    "room": { ... },
    "user": "...",
    "guestName": "John Doe",
    "checkInDate": "2024-02-01T15:00:00Z",
    "checkOutDate": "2024-02-05T11:00:00Z",
    "numberOfGuests": 2,
    "totalPrice": 600,
    "status": "Confirmed"
  }
]
```

### Get Booking Details
```
GET /bookings/:bookingId/details
Authorization: Bearer <user-token>
```
**Response (200):** Returns booking object with populated room and user data

### Cancel Booking
```
PUT /bookings/:bookingId/cancel
Authorization: Bearer <user-token>
```
**Response (200):**
```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    "_id": "...",
    "status": "Cancelled",
    ...
  }
}
```

### Check Room Availability
```
GET /bookings/availability/:roomId
```
**Response (200):**
```json
[
  {
    "checkInDate": "2024-02-01T15:00:00Z",
    "checkOutDate": "2024-02-05T11:00:00Z"
  },
  {
    "checkInDate": "2024-02-15T15:00:00Z",
    "checkOutDate": "2024-02-20T11:00:00Z"
  }
]
```

### Get All Bookings (Admin Only)
```
GET /bookings/admin/all
Authorization: Bearer <admin-token>
```
**Response (200):** Returns array of all bookings with populated data

---

## ⚠️ Error Responses

### 400 - Bad Request
```json
{
  "message": "Missing required fields" / "Room already booked for this time period" / etc
}
```

### 401 - Unauthorized
```json
{
  "message": "Not authorized" / "Invalid token"
}
```

### 403 - Forbidden
```json
{
  "message": "Admin access only" / "Not authorized to cancel this booking"
}
```

### 404 - Not Found
```json
{
  "message": "Room not found" / "Booking not found" / "User not found"
}
```

### 500 - Server Error
```json
{
  "message": "Error message details..."
}
```

---

## 🔖 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 📊 Data Types

### Room Type Values
- Single
- Double
- Deluxe
- Suite

### Booking Status Values
- Pending
- Confirmed
- Cancelled

### User Role Values
- USER
- ADMIN

---

## 🔑 Authentication Flow

1. **Register** - Create new account
   ```
   POST /auth/register
   ```

2. **Login** - Get JWT token
   ```
   POST /auth/login
   ```

3. **Use Token** - Include in Authorization header for protected endpoints
   ```
   Authorization: Bearer <token>
   ```

4. **Token Expires** - After 1 day, need to login again

---

## 💡 API Usage Examples

### Example 1: Complete Booking Flow

1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

2. Get available rooms
```bash
curl http://localhost:5000/api/rooms?type=Deluxe
```

3. Check room availability
```bash
curl http://localhost:5000/api/bookings/availability/roomId123
```

4. Create booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "roomId":"roomId123",
    "guestName":"John Doe",
    "guestEmail":"john@example.com",
    "guestPhone":"+1234567890",
    "checkInDate":"2024-02-01T15:00:00Z",
    "checkOutDate":"2024-02-05T11:00:00Z",
    "numberOfGuests":2
  }'
```

5. View bookings
```bash
curl http://localhost:5000/api/bookings/my-bookings \
  -H "Authorization: Bearer <token>"
```

---

## 🧪 Testing Tips

- Always check the request body matches the required fields
- Add proper Content-Type header: `application/json`
- Include full Authorization header with Bearer token
- Test error cases (invalid dates, overlapping bookings, etc.)
- Use tools like Postman or curl for testing

---

## ✅ Validation Rules

### Booking
- Check-out must be after check-in
- Number of guests cannot exceed room capacity
- Room cannot be booked for overlapping dates
- guestEmail must be valid email format
- All required fields must be provided

### Room
- roomNumber must be unique
- type must be one of: Single, Double, Deluxe, Suite
- price must be positive number
- capacity must be positive number

### User
- email must be unique
- password will be hashed automatically
- email must be valid format

---

For more information, see HOTEL_BOOKING_SYSTEM.md
