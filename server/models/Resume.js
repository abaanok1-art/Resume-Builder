import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One primary resume per user
  },
  // Flexible storage for MS Word-like document content
  documentData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  documentHtml: {
    type: String,
    default: ''
  },
  templateName: {
    type: String,
    default: 'blank'
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
