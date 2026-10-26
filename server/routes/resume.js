import express from 'express';
import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import { localDb } from '../services/storage.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/resume
// @desc    Get user's saved resume
router.get('/', protect, async (req, res) => {
  try {
    let resume = null;

    if (mongoose.connection.readyState === 1) {
      resume = await Resume.findOne({ userId: req.user.id });
    } else {
      resume = localDb.getResume(req.user.id);
    }

    res.json({
      success: true,
      resume
    });
  } catch (err) {
    console.error('Fetch resume error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume'
    });
  }
});

// @route   POST /api/resume
// @desc    Save or update user's resume
router.post('/', protect, async (req, res) => {
  try {
    const { documentData, documentHtml, templateName } = req.body;

    let updatedResume = null;

    if (mongoose.connection.readyState === 1) {
      updatedResume = await Resume.findOneAndUpdate(
        { userId: req.user.id },
        {
          userId: req.user.id,
          documentData: documentData || {},
          documentHtml: documentHtml || '',
          templateName: templateName || 'blank',
          updatedAt: new Date()
        },
        { new: true, upsert: true, runValidators: true }
      );
    } else {
      updatedResume = localDb.saveResume(req.user.id, {
        documentData: documentData || {},
        documentHtml: documentHtml || '',
        templateName: templateName || 'blank'
      });
    }

    res.json({
      success: true,
      message: 'Resume saved successfully to your account!',
      resume: updatedResume
    });
  } catch (err) {
    console.error('Save resume error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to save resume'
    });
  }
});

export default router;
