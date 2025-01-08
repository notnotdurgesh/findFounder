const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DeveloperSchema = new mongoose.Schema({
  githubId: { type: String, sparse: true },
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  avatarUrl: { type: String },
  title: { type: String },
  location: { type: String },
  yearsOfExperience: { type: Number },
  bio: { type: String },
  skills: [{ type: String }],
  topSkills: [{
    name: { type: String },
    level: { type: Number }
  }],
  githubUrl: { type: String },
  linkedinUrl: { type: String },
  personalWebsite: { type: String },
  education: [{
    degree: { type: String },
    school: { type: String },
    year: { type: String }
  }],
  workExperience: [{
    title: { type: String },
    company: { type: String },
    duration: { type: String },
    description: { type: String }
  }],
  projects: [{
    name: { type: String },
    description: { type: String },
    link: { type: String }
  }],
  achievements: [{ type: String }],
  languages: [{ type: String }],
  
  phone: { type: String, sparse: true },
  isPhoneVerified: { type: Boolean, default: false },
  phoneVerificationCode: { type: String },
  phoneVerificationCodeExpires: { type: Date }

}, { timestamps: true });

// Password hashing middleware
DeveloperSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

DeveloperSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Developer', DeveloperSchema);