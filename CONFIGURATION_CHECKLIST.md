# Configuration Checklist - Hotel Booking System

Use this checklist to verify your setup is complete and working.

## 🔧 Backend Configuration

### Prerequisites
- [ ] Node.js installed (v14+)
- [ ] npm installed
- [ ] MongoDB installed/accessible

### Backend Setup
- [ ] Navigate to `/backend` directory
- [ ] Run `npm install`
- [ ] Create `.env` file in `/backend`
- [ ] Add these to `.env`:
  ```
  MONGO_URI=mongodb://localhost:27017/hotel-booking
  JWT_SECRET=your-secret-key-12345
  PORT=5000
  ```

### Start Backend
- [ ] Run `npm start` or `npm run dev`
- [ ] Check console for "🚀 Server running on port 5000"
- [ ] Verify MongoDB connection "MongoDB Connected"
- [ ] Test: Open http://localhost:5000 in browser
- [ ] Should see: `{"message": "Room Booking API Running"}`

---

## 🎨 Frontend Configuration

### Prerequisites
- [ ] Node.js installed (v14+)
- [ ] npm installed

### Frontend Setup
- [ ] Navigate to `/frontend` directory
- [ ] Run `npm install`
- [ ] Verify API base URL in `src/services/api.js`
  - Should be: `http://localhost:5000/api`

### Start Frontend
- [ ] Run `npm start`
- [ ] Browser automatically opens to http://localhost:3000
- [ ] Should see login page with "Hotel Booking System" heading
- [ ] No errors in console

---

## ✅ API Verification

### Run These Tests (using Postman or curl)

**Test 1: Backend Running**
```bash
curl http://localhost:5000
```
✅ Should return: `{"message": "Room Booking API Running"}`

**Test 2: User Registration**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```
✅ Should return 201 status with user data

**Test 3: User Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
✅ Should return token

**Test 4: Get Rooms**
```bash
curl http://localhost:5000/api/rooms
```
✅ Should return empty array [] (initially) or rooms if added

---

## 🌐 Frontend Application Test

### Test Registration Flow
- [ ] Go to http://localhost:3000/register
- [ ] Fill in name, email, password
- [ ] Confirm password matches
- [ ] Click Register
- [ ] Should see "Registration successful" message
- [ ] Redirected to login page

### Test Login Flow
- [ ] On login page, enter email and password
- [ ] Click Login
- [ ] Should see "Login successful" message
- [ ] Redirected to Dashboard
- [ ] No errors in browser console

### Test Dashboard
- [ ] Should see "Browse Rooms" and "My Bookings" buttons
- [ ] Room filter dropdown available
- [ ] If no rooms, should see "No rooms available"

---

## 🗄️ Database Setup

### MongoDB Local Setup
- [ ] Install MongoDB Community Edition
- [ ] Start MongoDB service:
  - **Windows**: MongoDB should auto-start, or start via Services
  - **Mac**: `brew services start mongodb-community`
  - **Linux**: `sudo systemctl start mongod`
- [ ] Test connection: `mongosh` should connect

### MongoDB Cloud (Atlas)
If using MongoDB Atlas:
- [ ] Create Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create a cluster
- [ ] Get connection string
- [ ] Replace `MONGO_URI` in `.env` with your connection string
- [ ] Format: `mongodb+srv://username:password@cluster.mongodb.net/hotel-booking`

---

## 📦 Dependencies Verification

### Backend Dependencies
Run in `/backend`:
```bash
npm list
```
Should show:
- [ ] express
- [ ] mongoose
- [ ] jsonwebtoken
- [ ] bcryptjs
- [ ] cors
- [ ] dotenv

### Frontend Dependencies
Run in `/frontend`:
```bash
npm list
```
Should show:
- [ ] react
- [ ] react-dom
- [ ] react-router-dom
- [ ] axios
- [ ] react-scripts

---

## 🔐 Security Checklist

- [ ] `.env` file is created with JWT_SECRET
- [ ] `.env` file is in `.gitignore` (not committed)
- [ ] Never push .env to repository
- [ ] JWT_SECRET is strong (random string)
- [ ] MONGO_URI doesn't have credentials in code
- [ ] CORS is configured correctly

---

## 🐛 Troubleshooting

### Backend Won't Start
1. [ ] Check if port 5000 is available: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
2. [ ] Check Node.js version: `node --version` (should be v14+)
3. [ ] Check npm packages installed: `npm install` again
4. [ ] Check `.env` variables are set
5. [ ] Check MongoDB is running

### Frontend Won't Start
1. [ ] Check if port 3000 is available
2. [ ] Delete `node_modules` and `package-lock.json`
3. [ ] Run `npm install` again
4. [ ] Check Node.js version
5. [ ] Check for syntax errors in code

### Can't Connect to API
1. [ ] Verify backend is running on port 5000
2. [ ] Check API base URL in `src/services/api.js`
3. [ ] Check CORS is enabled in backend
4. [ ] Check browser console for error messages
5. [ ] Verify network connectivity

### MongoDB Connection Error
1. [ ] Check MongoDB is running: `mongosh`
2. [ ] Verify MONGO_URI in `.env`
3. [ ] Check username/password if using Atlas
4. [ ] Check network connection for Atlas
5. [ ] Try local MongoDB if Atlas fails

### Login/Registration Fails
1. [ ] Check backend is running
2. [ ] Check error message in browser
3. [ ] Verify email format is valid
4. [ ] Check password is at least 6 characters
5. [ ] Try with different email address

---

## 📋 Directory Structure Verification

Check these files exist:

### Backend
- [ ] `backend/server.js`
- [ ] `backend/config/db.js`
- [ ] `backend/models/User.js`
- [ ] `backend/models/Room.js`
- [ ] `backend/models/Booking.js`
- [ ] `backend/controllers/authController.js`
- [ ] `backend/controllers/roomController.js`
- [ ] `backend/controllers/bookingController.js`
- [ ] `backend/routes/authroutes.js`
- [ ] `backend/routes/roomRoutes.js`
- [ ] `backend/routes/bookingRoutes.js`
- [ ] `backend/middleware/authMiddleware.js`
- [ ] `backend/package.json`
- [ ] `backend/.env`

### Frontend
- [ ] `frontend/src/pages/Login.js`
- [ ] `frontend/src/pages/Register.js`
- [ ] `frontend/src/pages/Dashboard.js`
- [ ] `frontend/src/services/api.js`
- [ ] `frontend/src/styles/auth.css`
- [ ] `frontend/src/styles/dashboard.css`
- [ ] `frontend/src/App.js`
- [ ] `frontend/package.json`

### Documentation
- [ ] `HOTEL_BOOKING_SYSTEM.md`
- [ ] `QUICK_START_GUIDE.md`
- [ ] `API_DOCUMENTATION.md`
- [ ] `IMPLEMENTATION_SUMMARY.md`
- [ ] `CONFIGURATION_CHECKLIST.md` (this file)

---

## ✨ Final Verification

Once all items above are checked:

1. [ ] Backend running on http://localhost:5000 ✅
2. [ ] Frontend running on http://localhost:3000 ✅
3. [ ] Can register new user ✅
4. [ ] Can login with registered user ✅
5. [ ] Dashboard loads after login ✅
6. [ ] Can see rooms on dashboard ✅
7. [ ] No console errors in browser ✅
8. [ ] No errors in backend console ✅

---

## 🎉 Ready to Use!

If all items above are checked, your hotel booking system is fully operational!

### Next Steps:
1. Test with sample data
2. Try booking a room
3. Explore admin features
4. Share with others!

---

## 📞 Quick Reference

| Component | URL | Port | Command |
|-----------|-----|------|---------|
| Backend | http://localhost:5000 | 5000 | `npm start` |
| Frontend | http://localhost:3000 | 3000 | `npm start` |
| MongoDB | mongodb://localhost:27017 | 27017 | `mongosh` |

---

**Status: ✅ Ready to Go!**

Your hotel booking system is fully configured and ready to use.
