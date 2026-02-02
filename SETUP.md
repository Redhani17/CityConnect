# Quick Setup Guide

## Prerequisites
- Node.js (v16+) installed
- MongoDB Atlas account (free tier works)
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Whitelist your IP (or use 0.0.0.0/0 for development)
6. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_super_secret_key_min_32_characters
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

Backend should run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

(Optional) Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Frontend should run on `http://localhost:3000`

### 4. Test the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account (choose Citizen or Admin role)
3. Login with your credentials
4. Explore the features!

## Default Test Accounts

You can create test accounts through the registration page:
- **Citizen**: Register with role "citizen"
- **Admin**: Register with role "admin"

## Features to Test

### As Citizen:
- Submit a complaint with image
- View your bills and make mock payments
- Use the SOS emergency button
- Chat with the AI assistant
- View announcements and filter them
- Browse job opportunities

### As Admin:
- View all complaints
- Update complaint status and assign departments
- Create announcements
- Post job opportunities
- Manage all content

## Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct
- Ensure PORT 5000 is not in use
- Check `.env` file exists and has correct values

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify `VITE_API_URL` in frontend `.env`

### Images not uploading
- Check `backend/uploads/` directory exists
- Ensure multer middleware is configured correctly
- Check file size (max 5MB)

### Authentication issues
- Clear browser localStorage
- Check JWT_SECRET is set in backend `.env`
- Verify token is being sent in request headers

## Production Deployment

For production:
1. Set `NODE_ENV=production` in backend `.env`
2. Use a strong `JWT_SECRET` (32+ characters)
3. Configure proper CORS origins
4. Use environment variables for all sensitive data
5. Build frontend: `cd frontend && npm run build`
6. Serve frontend build with a web server (nginx, etc.)

## Support

For issues or questions, check the README.md file for more details.
