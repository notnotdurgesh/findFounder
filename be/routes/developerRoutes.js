const express = require('express');
const jwt = require('jsonwebtoken');
const Developer = require('../models/developer');
const Founder = require('../models/founder.js')
const passport = require('passport');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();



// Simple Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingDeveloper = await Developer.findOne({ email });
    if (existingDeveloper) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const developer = await Developer.create({ email, password });
    const token = jwt.sign({ id: developer._id, role: 'Developer' }, process.env.JWT_SECRET);

    res.status(201).json({ message: 'Developer registered successfully!', token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const developer = await Developer.findOne({ email });
    if (!developer || !developer.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await developer.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: developer._id, role: 'Developer' }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Login successful!', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set password for GitHub-authenticated users
router.post('/set-password', authenticateToken, authorizeRole('Developer'), async (req, res) => {
  const { password } = req.body;

  try {
    const developer = await Developer.findById(req.user.id);
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    if (developer.password) {
      return res.status(400).json({ message: 'Password already set' });
    }

    developer.password = password;
    await developer.save();

    res.status(200).json({ message: 'Password set successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Developer Profile
router.get('/developers/:id', authenticateToken, async (req, res) => {
  try {
    const developer = await Developer.findById(req.params.id).select('-password');
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    // Format the response to match the frontend data structure
    const formattedProfile = {
      id: developer._id,
      name: developer.name || '',
      avatar: developer.avatarUrl || '/placeholder.svg',
      title: developer.title || '',
      location: developer.location || '',
      yearsOfExperience: developer.yearsOfExperience || 0,
      bio: developer.bio || '',
      skills: developer.skills || [],
      topSkills: developer.topSkills || [],
      githubUrl: developer.githubUrl || '',
      linkedinUrl: developer.linkedinUrl || '',
      personalWebsite: developer.personalWebsite || '',
      email: developer.email || '',
      education: developer.education || [],
      workExperience: developer.workExperience || [],
      projects: developer.projects || [],
      achievements: developer.achievements || [],
      languages: developer.languages || []
    };

    res.status(200).json(formattedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Developer Profile
router.get('/', authenticateToken, authorizeRole('Developer'), async (req, res) => {
  try {
    const developer = await Developer.findById(req.user.id).select('-password');
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    // Format the response to match the frontend data structure
    const formattedProfile = {
      id: developer._id,
      name: developer.name || '',
      avatar: developer.avatarUrl || '/placeholder.svg',
      title: developer.title || '',
      location: developer.location || '',
      yearsOfExperience: developer.yearsOfExperience || 0,
      bio: developer.bio || '',
      skills: developer.skills || [],
      topSkills: developer.topSkills || [],
      githubUrl: developer.githubUrl || '',
      linkedinUrl: developer.linkedinUrl || '',
      personalWebsite: developer.personalWebsite || '',
      email: developer.email || '',
      education: developer.education || [],
      workExperience: developer.workExperience || [],
      projects: developer.projects || [],
      achievements: developer.achievements || [],
      languages: developer.languages || []
    };

    res.status(200).json(formattedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Developer Profile
router.put('/developers', authenticateToken, authorizeRole('Developer'), async (req, res) => {
  try {
    userId = req.user.id;

    const allowedUpdates = {
      name: req.body.name,
      title: req.body.title,
      location: req.body.location,
      yearsOfExperience: req.body.yearsOfExperience,
      bio: req.body.bio,
      skills: req.body.skills,
      topSkills: req.body.topSkills,
      githubUrl: req.body.githubUrl,
      linkedinUrl: req.body.linkedinUrl,
      personalWebsite: req.body.personalWebsite,
      education: req.body.education,
      workExperience: req.body.workExperience,
      projects: req.body.projects,
      achievements: req.body.achievements,
      languages: req.body.languages
    };

    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => 
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const developer = await Developer.findByIdAndUpdate(
      userId,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    res.status(200).json(developer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Founders with Search and Filters
router.get('/founders', authenticateToken, authorizeRole('Developer'), async (req, res) => {
  try {
    const { sort = 'recent', page = 1, limit = 10, ...filters } = req.query;

    // Build the query dynamically
    const query = {};

    for (const key in filters) {
      if (filters[key]) {
        if (key === 'search') {
          // General search across multiple fields
          query.$or = [
            { startupName: { $regex: filters[key], $options: 'i' } },
            { description: { $regex: filters[key], $options: 'i' } },
            { tagline: { $regex: filters[key], $options: 'i' } },
            { industry: { $regex: filters[key], $options: 'i' } },
            { techStack: { $regex: filters[key], $options: 'i' } }
          ];
        } else if (key === 'minFunding' || key === 'maxFunding') {
          // Funding range filter
          if (!query.fundingAmount) query.fundingAmount = {};
          if (key === 'minFunding') query.fundingAmount.$gte = parseInt(filters[key]);
          if (key === 'maxFunding') query.fundingAmount.$lte = parseInt(filters[key]);
        } else if (key === 'openPositions' && filters[key] === 'true') {
          // Open positions filter
          query.openPositions = { $exists: true, $ne: [] };
        } else {
          // Handle other filters as case-insensitive regex
          query[key] = { $regex: filters[key], $options: 'i' };
        }
      }
    }

    // Sorting options
    const sortOption = {
      recent: { createdAt: -1 },
      funding: { fundingAmount: -1 },
      employees: { employeeCount: -1 }
    }[sort] || { createdAt: -1 };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch data
    const founders = await Founder.find(query)
      .select('-password -email') // Exclude sensitive fields
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Total count for pagination
    const total = await Founder.countDocuments(query);

    // Format response
    res.status(200).json({
      founders,
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


// GitHub Login Route
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', failureMessage: true }),
  async (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id, role: 'Developer' }, process.env.JWT_SECRET);

      // Fetch the developer details to check if a password is set
      const developer = await Developer.findById(req.user._id);

      // Check if the password is set
      const passwordSet = !!developer?.password;
      const email = developer.email;

      // Redirect based on whether the password is set
      const redirectUrl = passwordSet
        ? `${process.env.FRONTEND_URL}/auth-success?token=${token}&key=true&email=${encodeURIComponent(email)}`
        : `${process.env.FRONTEND_URL}/auth-success?token=${token}&key=false&email=${encodeURIComponent(email)}`;

      res.redirect(redirectUrl);

    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).json({ error: 'Authentication successful but failed to process request' });
    }
  }
);
// Set password for GitHub-authenticated users
router.post('/set-password', authenticateToken, authorizeRole('Developer'), async (req, res) => {
  const { password } = req.body;

  try {
    const developer = await Developer.findById(req.user.id);
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    if (developer.password) {
      return res.status(400).json({ message: 'Password already set' });
    }

    developer.password = password;
    await developer.save();

    res.status(200).json({ message: 'Password set successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Failed to log out' });
    res.status(200).json({ message: 'Logged out successfully' });
  });
});


module.exports = router;
