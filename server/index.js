import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS) and JSON request parsing
app.use(cors());
app.use(express.json());

// =========================================================================
// 🟢 MONGODB ATLAS CONNECTION
const MONGO_URI = process.env.MONGO_URI || "";

let dbPromise = null;
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGO_URI || MONGO_URI;
  if (!uri || uri.trim() === "") return;

  if (!dbPromise) {
    dbPromise = mongoose.connect(uri)
      .then(() => {
        console.log('✅ [MongoDB] Connected to MongoDB Atlas cluster successfully!');
      })
      .catch((err) => {
        dbPromise = null;
        console.error('❌ [MongoDB] Connection error:', err.message);
      });
  }
  await dbPromise;
};

// Initial connection for persistent servers
if (MONGO_URI && MONGO_URI.trim() !== "") {
  connectDB();
}

// Middleware to ensure DB connection is ready on serverless function invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connect middleware error:', err);
  }
  next();
});

// API Routes (supports both /api/auth and /auth paths)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/resume', '/resume'], resumeRoutes);

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    message: 'Resume Builder API is running smoothly',
    databaseConnected: mongoose.connection.readyState === 1
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 [Server] Resume Builder backend running on http://localhost:${PORT}`);
  });
}

export default app;
