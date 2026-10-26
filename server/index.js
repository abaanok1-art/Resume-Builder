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
// PASTE YOUR MONGODB ATLAS CLUSTER LINK INSIDE THE QUOTES BELOW (OR IN .env)
const MONGO_URI = process.env.MONGO_URI || "";

if (MONGO_URI && MONGO_URI.trim() !== "") {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ [MongoDB] Connected to MongoDB Atlas cluster successfully!');
    })
    .catch((err) => {
      console.error('❌ [MongoDB] Connection error:', err.message);
    });
} else {
  // Left empty for you to paste your link as requested:
  // mongoose.connect("");
  console.log('------------------------------------------------------------');
  console.log('⚠️  [MongoDB] Connection string is currently empty.');
  console.log('👉 Paste your MongoDB Atlas cluster link inside MONGO_URI in:');
  console.log('   - server/.env  (MONGO_URI="your_link_here")');
  console.log('   OR');
  console.log('   - server/index.js (const MONGO_URI = "your_link_here")');
  console.log('------------------------------------------------------------');
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'Resume Builder API is running smoothly',
    databaseConnected: mongoose.connection.readyState === 1
  });
});

app.listen(PORT, () => {
  console.log(`🚀 [Server] Resume Builder backend running on http://localhost:${PORT}`);
});
