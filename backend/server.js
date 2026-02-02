import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import billRoutes from './routes/bill.routes.js';
import emergencyRoutes from './routes/emergency.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import jobRoutes from './routes/job.routes.js';
import twilioRoutes from './routes/twilio.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection with retry and local fallback
async function connectWithRetry() {
  const atlasUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/cityconnect';
  const maxRetries = 3;

  // Try Atlas first (if provided)
  if (atlasUri) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await mongoose.connect(atlasUri);
        console.log('✅ MongoDB Atlas connected successfully');
        return;
      } catch (err) {
        console.error(`Attempt ${attempt} - MongoDB Atlas connection error:`, err.message);
        if (attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, 3000));
        }
      }
    }
    console.warn('⚠️ Unable to connect to MongoDB Atlas after multiple attempts.');
  }

  // Fallback: try local MongoDB
  try {
    await mongoose.connect(localUri);
    console.log('✅ Connected to local MongoDB fallback');
    return;
  } catch (err) {
    console.error('❌ Local MongoDB connection error:', err.message);
  }

  console.error('❌ All MongoDB connection attempts failed. If you intended to use Atlas, ensure your current IP is whitelisted and credentials are correct.');
}

connectWithRetry();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/twilio', twilioRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CityConnect API is running' });
});

// DB status endpoint: reports which DB we're connected to and counts for key collections
import User from './models/User.model.js';
import Complaint from './models/Complaint.model.js';
import Announcement from './models/Announcement.model.js';

app.get('/api/dbstatus', async (req, res) => {
  try {
    const conn = mongoose.connection;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const dbInfo = {
      readyState: conn.readyState,
      state: stateMap[conn.readyState] || 'unknown',
      host: conn.host || null,
      port: conn.port || null,
      name: conn.name || null,
    };

    // Get counts (safe if collections don't exist yet)
    const [usersCount, complaintsCount, announcementsCount] = await Promise.all([
      User.countDocuments().catch(() => 0),
      Complaint.countDocuments().catch(() => 0),
      Announcement.countDocuments().catch(() => 0),
    ]);

    res.json({ success: true, db: dbInfo, counts: { users: usersCount, complaints: complaintsCount, announcements: announcementsCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
