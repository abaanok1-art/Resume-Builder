import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { localDb } from '../services/storage.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'resumebuilder_secret_jwt_key_2026_xyz';

const generateToken = (id, name, email) => {
  return jwt.sign({ id, name, email }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user (takes name, email, password)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // If MongoDB is connected, use Mongoose
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      });

      const token = generateToken(user._id, user.name, user.email);
      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } else {
      // Local storage fallback so the user never gets an error
      const existing = localDb.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const newUser = localDb.createUser({
        name,
        email,
        password: hashedPassword
      });

      const token = generateToken(newUser.id, newUser.name, newUser.email);
      return res.status(201).json({
        success: true,
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      });
    }
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error during sign up'
    });
  }
});

// Also support /register alias
router.post('/register', async (req, res) => {
  req.url = '/signup';
  return router.handle(req, res);
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (takes email, password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    let userFound = null;
    let userId = null;

    if (mongoose.connection.readyState === 1) {
      userFound = await User.findOne({ email: email.toLowerCase() });
      if (userFound) userId = userFound._id;
    } else {
      userFound = localDb.findUserByEmail(email);
      if (userFound) userId = userFound.id;
    }

    if (!userFound) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(userId, userFound.name, userFound.email);

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        name: userFound.name,
        email: userFound.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile from token
router.get('/me', protect, async (req, res) => {
  try {
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user.id).select('-password');
    } else {
      user = localDb.findUserById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
