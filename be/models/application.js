const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true
  },
  founder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Founder',
    required: true
  },
  position: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    required: true
  },
  resume: {
    type: String // URL to resume file
  },
  notes: {
    type: String // Founder's private notes
  },
  expectedSalary: {
    type: Number
  },
  startDate: {
    type: Date
  }
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;