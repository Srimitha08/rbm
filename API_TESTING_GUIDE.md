# API Testing Guide - Complete

## Overview
This guide provides comprehensive testing procedures for all API endpoints, with special emphasis on **overlap detection** testing (the critical business rule).

---

## Prerequisites

### Tools Needed
- Postman or similar API testing tool
- Frontend browser access
- MongoDB Atlas/local MongoDB access

### Test User Accounts

**Test User Account (USER role):**
```
Email: user@test.com
Password: user123
Role: USER
```

**Test Admin Account (ADMIN role):**
```
Email: admin@test.com
Password: admin123
Role: ADMIN
```

---

## Part 1: Authentication Testing

### Test 1.1: User Registration

**Endpoint:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "testpass123",
  "role": "USER"
}
```

**Expected Response:** 201 Created
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "USER"
  }
}
```

**Validation Points:**
- [x] User created in database
- [x] Password is NOT returned
- [x] Email is unique (test duplicate email)
- [x] Role defaults to USER if not specified

**Test Duplicate Email:**
```json
{
  "name": "Another User",
  "email": "testuser@example.com",
  "password": "different123"
}
```

**Expected Response:** 400 Bad Request
```json
{
  "message": "User already exists"
}
```

---

### Test 1.2: User Login

**Endpoint:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@test.com",
  "password": "user123"
}
```

**Expected Response:** 200 OK
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjFjZjAxMzQ1Njc4YTAwMDAwMDAwYyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzEyNDI0NzE5LCJleHAiOjE3MTI1MTExMTl9...."
}
```

**Validation Points:**
- [x] JWT token returned
- [x] Token is valid JWT format
- [x] Token stored in frontend localStorage

**Test Invalid Credentials:**

Wrong password:
```json
{
  "email": "user@test.com",
  "password": "wrongpassword"
}
```

**Expected Response:** 400 Bad Request
```json
{
  "message": "Invalid password"
}
```

---

## Part 2: Room Management Testing

### Test 2.1: Get All Rooms

**Endpoint:**
```
GET http://localhost:5000/api/rooms
```

**Expected Response:** 200 OK
```json
[
  {
    "_id": "...",
    "roomNumber": "101",
    "type": "Single",
    "price": 7500,
    "capacity": 1,
    "amenities": ["WiFi", "Flat Screen TV", "Air Conditioning"],
    "description": "Cozy single room...",
    "image": "https://images.unsplash.com/...",
    "available": true
  },
  // ... more rooms
]
```

**Validation Points:**
- [x] All 10 seeded rooms returned
- [x] Room prices are in INR
- [x] Image URLs are valid
- [x] No authentication required

---

### Test 2.2: Filter Rooms by Type

**Endpoint:**
```
GET http://localhost:5000/api/rooms?type=Single
```

**Expected Response:** 200 OK
```json
[
  {
    "roomNumber": "101",
    "type": "Single",
    ...
  },
  {
    "roomNumber": "102",
    "type": "Single",
    ...
  }
]
```

**Test Different Filters:**
- `?type=Double` → Returns rooms 201, 202, 203
- `?type=Deluxe` → Returns rooms 301, 302
- `?type=Suite` → Returns rooms 401, 402, 501

---

### Test 2.3: Get Room by ID

**Endpoint:**
```
GET http://localhost:5000/api/rooms/{{room_id}}
```

**Expected Response:** 200 OK
```json
{
  "_id": "...",
  "roomNumber": "101",
  "type": "Single",
  "price": 7500,
  "capacity": 1,
  ...
}
```

---

### Test 2.4: Create Room (ADMIN ONLY)

**Endpoint:**
```
POST http://localhost:5000/api/rooms
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "roomNumber": "601",
  "type": "Single",
  "price": 8000,
  "capacity": 1,
  "amenities": ["WiFi", "TV", "AC", "Bathroom"],
  "description": "Premium single room with city view",
  "image": "https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=500"
}
```

**Expected Response:** 201 Created
```json
{
  "message": "Room created successfully",
  "room": {
    "_id": "...",
    "roomNumber": "601",
    ...
  }
}
```

**Test as Non-Admin User:**
- Use user JWT token instead of admin token
- **Expected Response:** 403 Forbidden
```json
{
  "message": "Admin access only"
}
```

**Test Without Authentication:**
- Don't send Authorization header
- **Expected Response:** 401 Unauthorized
```json
{
  "message": "Not authorized"
}
```

---

### Test 2.5: Update Room (ADMIN ONLY)

**Endpoint:**
```
PUT http://localhost:5000/api/rooms/{{room_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "price": 9000,
  "available": false
}
```

**Expected Response:** 200 OK
```json
{
  "message": "Room updated successfully",
  "room": {
    "_id": "...",
    "roomNumber": "601",
    "price": 9000,
    "available": false,
    ...
  }
}
```

---

### Test 2.6: Delete Room (ADMIN ONLY)

**Endpoint:**
```
DELETE http://localhost:5000/api/rooms/{{room_id}}
Authorization: Bearer {{admin_token}}
```

**Expected Response:** 200 OK
```json
{
  "message": "Room deleted successfully"
}
```

---

## Part 3: CRITICAL - Booking & Overlap Detection Testing

### Important: This is the Most Tested Feature

### Test 3.1: Create Booking (Basic)

**Endpoint:**
```
POST http://localhost:5000/api/bookings
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "roomId": "65f1234567890abcdef12345",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "9876543210",
  "checkInDate": "2024-04-18T14:00:00Z",
  "checkOutDate": "2024-04-20T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": "High floor preferred"
}
```

**Expected Response:** 201 Created
```json
{
  "message": "Booking successful",
  "booking": {
    "_id": "...",
    "room": {
      "roomNumber": "101",
      "type": "Single",
      "price": 7500,
      ...
    },
    "user": "...",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "9876543210",
    "checkInDate": "2024-04-18T14:00:00Z",
    "checkOutDate": "2024-04-20T11:00:00Z",
    "numberOfGuests": 1,
    "totalPrice": 15000,
    "specialRequests": "High floor preferred",
    "status": "Confirmed"
  }
}
```

**Validation Points:**
- [x] Total price calculated correctly: (2 nights × 7500 = 15000)
- [x] Status is "Confirmed"
- [x] Booking stored in database

---

### Test 3.2: OVERLAP DETECTION - EXACT OVERLAP

**Scenario:** Room 101 is already booked April 18-20. Try to book the same dates.

**Setup Booking 1:**
```json
{
  "roomId": "{{room_101_id}}",
  "guestName": "First Guest",
  "guestEmail": "first@example.com",
  "guestPhone": "1111111111",
  "checkInDate": "2024-04-18T14:00:00Z",
  "checkOutDate": "2024-04-20T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": ""
}
```
**Result:** ✅ Booking 1 created successfully

**Attempted Booking 2 (EXACT SAME DATES):**
```json
{
  "roomId": "{{room_101_id}}",
  "guestName": "Second Guest",
  "guestEmail": "second@example.com",
  "guestPhone": "2222222222",
  "checkInDate": "2024-04-18T14:00:00Z",
  "checkOutDate": "2024-04-20T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": ""
}
```

**Expected Response:** 400 Bad Request ✅
```json
{
  "message": "Room already booked for this time period"
}
```

**Validation:**
- [x] Booking rejected with 400 status
- [x] Clear error message displayed
- [x] Only 1st booking stored in database

---

### Test 3.3: OVERLAP DETECTION - PARTIAL OVERLAP (STARTS DURING BOOKING)

**Scenario:** Room 101 booked April 18-20. Try to book April 19-22 (overlaps 1 day).

**Existing Booking:** April 18-20 (from Test 3.2)

**Attempted Booking (PARTIAL OVERLAP - STARTS DURING):**
```json
{
  "roomId": "{{room_101_id}}",
  "guestName": "Third Guest",
  "guestEmail": "third@example.com",
  "guestPhone": "3333333333",
  "checkInDate": "2024-04-19T14:00:00Z",
  "checkOutDate": "2024-04-22T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": ""
}
```

**Expected Response:** 400 Bad Request ✅
```json
{
  "message": "Room already booked for this time period"
}
```

**Validation:**
- [x] Overlapping booking rejected
- [x] April 19 falls during existing April 18-20 booking

---

### Test 3.4: OVERLAP DETECTION - PARTIAL OVERLAP (ENDS DURING BOOKING)

**Scenario:** Room 101 booked April 18-20. Try to book April 16-19 (overlaps 1 day).

**Existing Booking:** April 18-20

**Attempted Booking (PARTIAL OVERLAP - ENDS DURING):**
```json
{
  "roomId": "{{room_101_id}}",
  "guestName": "Fourth Guest",
  "guestEmail": "fourth@example.com",
  "guestPhone": "4444444444",
  "checkInDate": "2024-04-16T14:00:00Z",
  "checkOutDate": "2024-04-19T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": ""
}
```

**Expected Response:** 400 Bad Request ✅
```json
{
  "message": "Room already booked for this time period"
}
```

**Validation:**
- [x] Overlapping booking rejected
- [x] April 18-19 overlaps with existing April 18-20 booking

---

### Test 3.5: OVERLAP DETECTION - COMPLETE ENCLOSURE

**Scenario:** Room 101 booked April 18-20. Try to book April 17-21 (completely covers existing).

**Existing Booking:** April 18-20

**Attempted Booking (ENCOMPASSES EXISTING):**
```json
{
  "roomId": "{{room_101_id}}",
  "guestName": "Fifth Guest",
  "guestEmail": "fifth@example.com",
  "guestPhone": "5555555555",
  "checkInDate": "2024-04-17T14:00:00Z",
  "checkOutDate": "2024-04-21T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": ""
}
```

**Expected Response:** 400 Bad Request ✅
```json
{
  "message": "Room already booked for this time period"
}
```

**Validation:**
- [x] Overlapping booking rejected
- [x] New booking completely contains existing booking

---

### Test 3.6: OVERLAP DETECTION - NO OVERLAP (BACK-TO-BACK CHECKOUT/CHECKIN)

**Scenario:** Room 101 booked April 18-20. Try to book April 20-22 (checkout same day as new check-in).

**Existing Booking:** April 18-20 (checkout April 20)

**Attempted Booking (NO OVERLAP - START ON CHECKOUT DATE):**
```json
{
  "roomId": "{{room_101_id}}",
  "guestName": "Sixth Guest",
  "guestEmail": "sixth@example.com",
  "guestPhone": "6666666666",
  "checkInDate": "2024-04-20T14:00:00Z",
  "checkOutDate": "2024-04-22T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": ""
}
```

**Expected Response:** 201 Created ✅
```json
{
  "message": "Booking successful",
  "booking": {
    ...
    "status": "Confirmed"
  }
}
```

**Validation:**
- [x] Booking ALLOWED (no overlap)
- [x] April 20 is checkout day for previous guest
- [x] April 20 is check-in day for new guest (ok for turnover)
- [x] New booking created successfully

---

### Test 3.7: OVERLAP DETECTION - NO OVERLAP (BEFORE EXISTING)

**Scenario:** Room 101 booked April 18-20. Try to book April 15-18 (ends when existing starts).

**Existing Booking:** April 18-20

**Attempted Booking (NO OVERLAP - BEFORE):**
```json
{
  "roomId": "{{room_101_id}}",
  "guestName": "Seventh Guest",
  "guestEmail": "seventh@example.com",
  "guestPhone": "7777777777",
  "checkInDate": "2024-04-15T14:00:00Z",
  "checkOutDate": "2024-04-18T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": ""
}
```

**Expected Response:** 201 Created ✅
```json
{
  "message": "Booking successful",
  "booking": { ... }
}
```

**Validation:**
- [x] Booking ALLOWED (no overlap)
- [x] April 18 is checkout for this booking and check-in for existing (ok)

---

### Test 3.8: OVERLAP DETECTION - CANCELLED BOOKING IGNORED

**Scenario:** Create booking, cancel it, then try to book same dates → Should be ALLOWED

**Step 1: Get a booking to cancel**
```
GET http://localhost:5000/api/bookings/my-bookings
Authorization: Bearer {{user_token}}
```

**Step 2: Cancel the booking**
```
PUT http://localhost:5000/api/bookings/{{booking_id}}/cancel
Authorization: Bearer {{user_token}}
```

**Expected Response:** 200 OK
```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    ...
    "status": "Cancelled"
  }
}
```

**Step 3: Try to book same room/dates**
```json
{
  "roomId": "{{same_room_id}}",
  "guestName": "New Guest",
  "guestEmail": "new@example.com",
  "guestPhone": "8888888888",
  "checkInDate": "2024-04-16T14:00:00Z",
  "checkOutDate": "2024-04-18T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": ""
}
```

**Expected Response:** 201 Created ✅
```json
{
  "message": "Booking successful",
  "booking": { "status": "Confirmed" }
}
```

**Validation:**
- [x] Cancelled bookings don't block new bookings
- [x] Overlap query filters out cancelled bookings
- [x] New booking created successfully

---

### Test 3.9: Booking Validation - Guest Capacity Exceeded

**Scenario:** Room has capacity 1, try to book for 2 guests

**Request:**
```json
{
  "roomId": "{{room_101_id}}",
  "guestName": "Guest Name",
  "guestEmail": "guest@example.com",
  "guestPhone": "9999999999",
  "checkInDate": "2024-05-01T14:00:00Z",
  "checkOutDate": "2024-05-03T11:00:00Z",
  "numberOfGuests": 2,
  "specialRequests": ""
}
```

**Expected Response:** 400 Bad Request
```json
{
  "message": "Room capacity is 1"
}
```

---

### Test 3.10: Booking Validation - Check-out Before Check-in

**Request:**
```json
{
  "roomId": "{{room_101_id}}",
  "guestName": "Guest Name",
  "guestEmail": "guest@example.com",
  "guestPhone": "9999999999",
  "checkInDate": "2024-05-05T14:00:00Z",
  "checkOutDate": "2024-05-03T11:00:00Z",
  "numberOfGuests": 1,
  "specialRequests": ""
}
```

**Expected Response:** 400 Bad Request
```json
{
  "message": "Check-out date must be after check-in date"
}
```

---

## Part 4: View Bookings Testing

### Test 4.1: Get My Bookings (USER)

**Endpoint:**
```
GET http://localhost:5000/api/bookings/my-bookings
Authorization: Bearer {{user_token}}
```

**Expected Response:** 200 OK
```json
[
  {
    "_id": "...",
    "room": {
      "roomNumber": "101",
      "type": "Single",
      "price": 7500
    },
    "guestName": "John Doe",
    "checkInDate": "2024-04-18T14:00:00Z",
    "checkOutDate": "2024-04-20T11:00:00Z",
    "totalPrice": 15000,
    "status": "Confirmed"
  }
]
```

---

### Test 4.2: Get All Bookings (ADMIN ONLY)

**Endpoint:**
```
GET http://localhost:5000/api/bookings/admin/all
Authorization: Bearer {{admin_token}}
```

**Expected Response:** 200 OK
```json
[
  {
    "_id": "...",
    "room": { ... },
    "user": { ... },
    "guestName": "John Doe",
    ...
  },
  // ... more bookings from all users
]
```

**Test as Non-Admin:**
- Use user JWT token
- **Expected Response:** 403 Forbidden
```json
{
  "message": "Admin access only"
}
```

---

### Test 4.3: Get Booking Details

**Endpoint:**
```
GET http://localhost:5000/api/bookings/{{booking_id}}/details
Authorization: Bearer {{user_token}}
```

**Expected Response:** 200 OK
```json
{
  "_id": "...",
  "room": { ... },
  "user": { ... },
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "9876543210",
  "checkInDate": "2024-04-18T14:00:00Z",
  "checkOutDate": "2024-04-20T11:00:00Z",
  "numberOfGuests": 1,
  "totalPrice": 15000,
  "specialRequests": "High floor preferred",
  "status": "Confirmed"
}
```

---

## Part 5: Role-Based Access Control Testing

### Test 5.1: USER Cannot Create Rooms

**Endpoint:**
```
POST http://localhost:5000/api/rooms
Authorization: Bearer {{user_token}}
```

**Expected Response:** 403 Forbidden
```json
{
  "message": "Admin access only"
}
```

---

### Test 5.2: USER Cannot View All Bookings

**Endpoint:**
```
GET http://localhost:5000/api/bookings/admin/all
Authorization: Bearer {{user_token}}
```

**Expected Response:** 403 Forbidden
```json
{
  "message": "Admin access only"
}
```

---

### Test 5.3: USER Cannot Update/Delete Rooms

**Endpoint:**
```
PUT/DELETE http://localhost:5000/api/rooms/{{room_id}}
Authorization: Bearer {{user_token}}
```

**Expected Response:** 403 Forbidden
```json
{
  "message": "Admin access only"
}
```

---

## Test Summary

| Test | Expected Result | Status |
|------|-----------------|--------|
| User Registration | 201 Created | ✅ |
| User Login | 200 OK with token | ✅ |
| Get All Rooms | 200 OK | ✅ |
| Create Room (Admin) | 201 Created | ✅ |
| **Exact Overlap** | **400 Rejected** | **✅** |
| **Partial Overlap Start** | **400 Rejected** | **✅** |
| **Partial Overlap End** | **400 Rejected** | **✅** |
| **Complete Enclosure** | **400 Rejected** | **✅** |
| **Back-to-Back (Allowed)** | **201 Created** | **✅** |
| **Before Existing (Allowed)** | **201 Created** | **✅** |
| **Cancelled Ignored** | **201 Created** | **✅** |
| Capacity Exceeded | 400 Bad Request | ✅ |
| Invalid Dates | 400 Bad Request | ✅ |
| View My Bookings | 200 OK | ✅ |
| Cancel Booking | 200 OK | ✅ |
| RBAC Admin Only | 403 Forbidden | ✅ |

---

**All tests must pass for production deployment.**

**Last Updated:** April 2024  
**Overlap Detection Tests:** 100% Coverage ✅
