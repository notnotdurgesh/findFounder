const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const twilio = require('twilio');
const Developer = require('../models/developer');
const Founder = require('../models/founder');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to get model based on role
const getModelByRole = (role) => {
  return role === 'developer' ? Developer : Founder;
};

// Request phone verification
router.post('/request-verification',
  [
    body('phone').isMobilePhone(),
    body('role').isIn(['developer', 'founder']),
    body('email').isEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phone, role, email } = req.body;
      const Model = getModelByRole(role);

      // Check if user exists
      const user = await Model.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate verification code
      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update user
      user.phone = phone;
      user.phoneVerificationCode = verificationCode;
      user.phoneVerificationCodeExpires = verificationCodeExpires;
      user.isPhoneVerified = false;
      await user.save();

      // Send SMS
      await client.messages.create({
        body: `Your verification code is: ${verificationCode}`,
        to: phone,
        from: process.env.TWILIO_PHONE_NUMBER
      });

      res.json({ message: 'Verification code sent successfully' });
    } catch (error) {
      console.error('Error in request-verification:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Verify phone number
router.post('/verify',
  [
    body('phone').isMobilePhone(),
    body('code').isLength({ min: 6, max: 6 }),
    body('role').isIn(['developer', 'founder']),
    body('email').isEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phone, code, role, email } = req.body;
      const Model = getModelByRole(role);

      // Find user
      const user = await Model.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify phone matches
      if (user.phone !== phone) {
        return res.status(400).json({ error: 'Phone number does not match' });
      }

      // Check if code is expired
      if (user.phoneVerificationCodeExpires < new Date()) {
        return res.status(400).json({ error: 'Verification code expired' });
      }

      // Check code
      if (user.phoneVerificationCode !== code) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      // Mark as verified
      user.isPhoneVerified = true;
      user.phoneVerificationCode = undefined;
      user.phoneVerificationCodeExpires = undefined;
      await user.save();

      res.json({ message: 'Phone verified successfully' });
    } catch (error) {
      console.error('Error in verify:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;