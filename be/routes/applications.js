const express = require('express');
const router = express.Router();
const Application = require('../models/application');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Developer Routes

// Submit new application
router.post('/apply/:founderId', authenticateToken, authorizeRole('Developer'), async (req, res) => {
  try {
    // Check if already applied
    const existingApplication = await Application.findOne({
      developer: req.user.id,
      founder: req.params.founderId,
      position: req.body.position
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this position' });
    }

    const application = await Application.create({
      developer: req.user.id,
      founder: req.params.founderId,
      position: req.body.position,
      coverLetter: req.body.coverLetter,
      resume: req.body.resume,
      expectedSalary: req.body.expectedSalary,
      startDate: req.body.startDate
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all applications for a developer
router.get('/my-applications', authenticateToken, authorizeRole('Developer'),  async (req, res) => {
  try {
    const applications = await Application.find({ developer: req.user.id })
      .populate('founder', 'startupName logo location industry email phone')
      .sort('-createdAt');

    const formattedApplications = applications.map(app => ({
      id: app._id,
      company: {
        name: app.founder.startupName,
        logo: app.founder.logo,
        location: app.founder.location,
        industry: app.founder.industry
      },
      position: app.position,
      status: app.status,
      appliedDate: app.createdAt,
      contactInfo: app.status === 'accepted' ? {
        email: app.founder.email,
        phone: app.founder.phone
      } : null
    }));

    res.status(200).json(formattedApplications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Founder Routes
// Get all applications for founder's startup
router.get('/received-applications', authenticateToken, authorizeRole('Founder'), async (req, res) => {
  try {
    const { status, position, sort = 'recent' } = req.query;
    
    let query = { founder: req.user.id };
    if (status) query.status = status;
    if (position) query.position = position;

    let sortOption = {};
    switch(sort) {
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'position':
        sortOption = { position: 1 };
        break;
    }

    const applications = await Application.find(query)
      .populate('developer', '-password')
      .sort(sortOption);
    
    const formattedApplications = applications.map(app => ({
      id: app._id,
      candidate: {
        id: app.developer._id,
        name: app.developer.name,
        avatar: app.developer.avatarUrl,
        title: app.developer.title,
        experience: app.developer.yearsOfExperience,
        location: app.developer.location,
        skills: app.developer.skills,
        githubUrl: app.developer.githubUrl,
        linkedinUrl: app.developer.linkedinUrl,
        ...(app.status === 'accepted' && {
          contactInfo: {
            email: app.developer.email,
            phone: app.developer.phone
          }
        })
      },
      application: {
        position: app.position,
        status: app.status,
        coverLetter: app.coverLetter,
        resume: app.resume,
        expectedSalary: app.expectedSalary,
        startDate: app.startDate,
        appliedDate: app.createdAt,
        notes: app.notes
      }
    }));

    res.status(200).json(formattedApplications);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Update application status
router.put('/update-status/:applicationId', authenticateToken, authorizeRole('Founder'),  async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findOneAndUpdate(
      { _id: req.params.applicationId, founder: req.user.id },
      { 
        status,
        notes,
        ...(status === 'accepted' ? { responseDate: new Date() } : {})
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      message: `Application ${status} successfully`,
      application
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
