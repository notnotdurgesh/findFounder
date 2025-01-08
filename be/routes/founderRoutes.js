const express = require('express');
const jwt = require('jsonwebtoken');
const Founder = require('../models/founder');
const Developer = require('../models/developer');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// Enhanced Signup
router.post('/signup', async (req, res) => {
  const {
    name,
    email,
    password,
    startupName,
    startupIdea,
    startupStage,
    technicalRequirements,
    benefitsForCoFounder,
  } = req.body;

  try {
    const existingFounder = await Founder.findOne({ email });
    if (existingFounder) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const founder = await Founder.create({
      name,
      email,
      password,
      startupName,
      startupIdea,
      startupStage,
      technicalRequirements,
      benefitsForCoFounder,
    });

    const token = jwt.sign({ id: founder._id, role: 'Founder' }, process.env.JWT_SECRET);

    res.status(201).json({ message: 'Founder registered successfully!', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const founder = await Founder.findOne({ email });
    if (!founder || !(await founder.comparePassword(password)) || !founder.isPhoneVerified) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: founder._id, role: 'Founder' }, process.env.JWT_SECRET);

    res.status(200).json({ message: 'Login successful!', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get founder's startup profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const founder = await Founder.findById(req.user.id).select('-password');
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }
    res.status(200).json(founder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get founder's startup profile by id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const founder = await Founder.findById(req.params.id).select('-password');
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }
    res.status(200).json(founder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update founder's startup profile
router.put('/profile', authenticateToken, authorizeRole('Founder'), async (req, res) => {
  try {
    const updateFields = {
      startupName: req.body.name,
      logo: req.body.logo,
      tagline: req.body.tagline,
      stage: req.body.stage,
      fundingAmount: req.body.fundingAmount,
      employeeCount: req.body.employeeCount,
      founded: req.body.founded,
      location: req.body.location,
      industry: req.body.industry,
      website: req.body.website,
      description: req.body.description,
      problem: req.body.problem,
      solution: req.body.solution,
      traction: req.body.traction,
      businessModel: req.body.businessModel,
      market: req.body.market,
      competition: req.body.competition,
      teamMembers: req.body.teamMembers,
      techStack: req.body.techStack,
      openPositions: req.body.openPositions,
      equity: req.body.equity,
      benefits: req.body.benefits,
      culture: req.body.culture,
      vision: req.body.vision,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      socialLinks: req.body.socialLinks
    };

    // Remove undefined fields
    Object.keys(updateFields).forEach(key => 
      updateFields[key] === undefined && delete updateFields[key]
    );

    const founder = await Founder.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }

    res.status(200).json({ 
      message: 'Profile updated successfully',
      founder 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Developers with Search and Filters
router.get('/developers/all', authenticateToken, authorizeRole('Founder'), async (req, res) => {
  try {
    const { sort = 'recent', page = 1, limit = 10, ...filters } = req.query;

    // Build the query dynamically
    const query = {};

    for (const key in filters) {
      if (filters[key]) {
        if (key === 'search') {
          // General search across multiple fields
          query.$or = [
            { name: { $regex: filters[key], $options: 'i' } },
            { bio: { $regex: filters[key], $options: 'i' } },
            { skills: { $regex: filters[key], $options: 'i' } },
            { title: { $regex: filters[key], $options: 'i' } },
            { location: { $regex: filters[key], $options: 'i' } }
          ];
        } else if (key === 'minExperience' || key === 'maxExperience') {
          // Experience range filter
          if (!query.yearsOfExperience) query.yearsOfExperience = {};
          if (key === 'minExperience') query.yearsOfExperience.$gte = parseInt(filters[key]);
          if (key === 'maxExperience') query.yearsOfExperience.$lte = parseInt(filters[key]);
        } else {
          // Handle other filters as case-insensitive regex
          query[key] = { $regex: filters[key], $options: 'i' };
        }
      }
    }

    // Sorting options
    const sortOption = {
      recent: { createdAt: -1 },
      experience: { yearsOfExperience: -1 },
      name: { name: 1 }
    }[sort] || { createdAt: -1 };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch data
    const developers = await Developer.find(query)
      .select('-password -email') // Exclude sensitive fields
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Total count for pagination
    const total = await Developer.countDocuments(query);

    // Format response
    res.status(200).json({
      developers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
