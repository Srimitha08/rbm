# Environment Setup Guide

## Backend Environment Variables (.env)

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000

# MongoDB Database Connection
# Format: mongodb+srv://username:password@cluster.mongodb.net/database_name
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/room_booking_db?ssl=true&replicaSet=atlas-p2ov1a-shard-0&authSource=admin&retryWrites=true&w=majority

# JWT Secret Key (Use a strong random string in production)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

### Environment Variable Explanation

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Express server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | `mySuperSecretKey123...` |

---

## Frontend Configuration

The frontend API endpoint is configured in `frontend/src/services/api.js`:

```javascript
// Current configuration (development)
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});
```

### For Production Deployment

Update the `baseURL` to your backend deployment URL:

```javascript
const API = axios.create({
  baseURL: "https://your-backend-url.com/api"  // Production backend
});
```

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project
4. Create a cluster
5. Create a database user with username and password
6. Get the connection string
7. Update `MONGO_URI` in `.env`

**Connection String Format:**
```
mongodb+srv://username:password@cluster-name.mongodb.net/database_name?ssl=true&authSource=admin&retryWrites=true&w=majority
```

### Option 2: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use local connection string:
```
MONGO_URI=mongodb://localhost:27017/room_booking_db
```

---

## JWT Secret Generation

Generate a strong JWT secret for production:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

---

## Security Best Practices

### Development
- Keep `.env` file in `.gitignore`
- Use test credentials only
- Enable debugging if needed

### Production
- Use strong JWT_SECRET (minimum 32 characters)
- Restrict MongoDB user permissions
- Enable MongoDB network authentication
- Use HTTPS only
- Implement rate limiting
- Add request validation
- Enable CORS selectively

---

## Verification Checklist

### Backend Setup ✅
- [ ] `backend/.env` file created
- [ ] `MONGO_URI` points to valid MongoDB
- [ ] `JWT_SECRET` is set to secure value
- [ ] `PORT=5000` configured
- [ ] `npm install` completed in backend
- [ ] `npm start` runs without errors
- [ ] Console shows: "Server running on port 5000"
- [ ] Console shows: "MongoDB Connected"

### Frontend Setup ✅
- [ ] API base URL properly configured
- [ ] `npm install` completed in frontend
- [ ] `npm start` runs without errors
- [ ] Application opens on `http://localhost:3000`
- [ ] No network errors in browser console

### Database Setup ✅
- [ ] MongoDB is accessible
- [ ] Collection created: `users`
- [ ] Collection created: `rooms`
- [ ] Collection created: `bookings`
- [ ] Indexes created for query optimization
- [ ] Seed script executed: `node backend/seed.js`
- [ ] 10 test rooms created with data

### API Testing ✅
- [ ] `GET /api/rooms` returns room list
- [ ] `POST /api/auth/register` creates user
- [ ] `POST /api/auth/login` returns JWT token
- [ ] `POST /api/bookings` creates booking with JWT
- [ ] Overlap detection rejects conflicting bookings
- [ ] `GET /api/bookings/admin/all` requires admin role

### Frontend Features ✅
- [ ] Registration page works
- [ ] Login page works
- [ ] Room listing displays
- [ ] Filters (type, price) work
- [ ] Booking form submits
- [ ] User can view own bookings
- [ ] Admin can view all bookings
- [ ] Cancellation works

### Security Validation ✅
- [ ] JWT token stored in localStorage
- [ ] Token sent in Authorization header
- [ ] Admin endpoints reject non-admin users
- [ ] Users cannot access admin features
- [ ] Passwords are hashed in database
- [ ] Overlap detection prevents double booking
- [ ] Expired tokens are rejected

---

## Deployment Environment Variables

### For Render/Heroku Backend
```
PORT=5000
MONGO_URI=<your-production-mongodb-uri>
JWT_SECRET=<secure-random-string>
```

### For Vercel/Netlify Frontend
```
REACT_APP_API_BASE_URL=<your-production-backend-url>
```

Note: Vercel/Netlify uses `REACT_APP_` prefix for environment variables accessible in browser

---

## Troubleshooting

### "Cannot connect to MongoDB"
- [ ] Verify `MONGO_URI` is correct
- [ ] Check MongoDB server is running
- [ ] Check IP whitelist in MongoDB Atlas
- [ ] Test connection string in MongoDB Compass

### "Invalid token"
- [ ] Token has expired (24 hour expiration)
- [ ] JWT_SECRET doesn't match between requests
- [ ] Token format is incorrect in header

### "Admin access only"
- [ ] Verify user role is "ADMIN" in database
- [ ] Check middleware is applied to route
- [ ] Verify JWT token contains role claim

### CORS Errors
- [ ] Check frontend baseURL matches backend URL
- [ ] Verify backend has CORS middleware enabled
- [ ] Check allowed origins configuration

---

## Next Steps for Production

1. **Buy Domain:** Register domain name
2. **Deploy Backend:**
   - Push to GitHub
   - Connect to Render/Railway/Heroku
   - Set environment variables
   - Deploy

3. **Deploy Frontend:**
   - Build: `npm run build`
   - Push to GitHub
   - Connect to Vercel/Netlify
   - Update API base URL
   - Deploy

4. **Post-Deployment:**
   - Test all endpoints
   - Monitor logs
   - Set up backup strategy
   - Configure monitoring/alerts

---

**Environment configuration is critical for system security and functionality.**
