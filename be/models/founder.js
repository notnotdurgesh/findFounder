// models/founder.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String
});

const FounderSchema = new mongoose.Schema({
  // Basic Auth Info
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  
  // Company Info
  startupName: { type: String, required: true },
  logo: { type: String },
  tagline: { type: String },
  stage: { type: String },
  fundingAmount: { type: String },
  employeeCount: { type: String },
  founded: { type: String },
  location: { type: String },
  industry: [String],
  website: { type: String },
  
  // Detailed Information
  description: { type: String },
  problem: { type: String },
  solution: { type: String },
  traction: { type: String },
  businessModel: { type: String },
  market: { type: String },
  competition: { type: String },
  
  // Team and Culture
  teamMembers: [TeamMemberSchema],
  techStack: [String],
  openPositions: [String],
  equity: { type: String },
  benefits: [String],
  culture: { type: String },
  vision: { type: String },
  
  // Contact Information
  contactEmail: { type: String },
  contactPhone: { type: String },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String }
  },
  phone: { type: String, sparse: true },
  isPhoneVerified: { type: Boolean, default: false },
  phoneVerificationCode: { type: String },
  phoneVerificationCodeExpires: { type: Date }

}, { timestamps: true });

FounderSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

FounderSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const Founder = mongoose.model('Founder', FounderSchema);
module.exports = Founder;
