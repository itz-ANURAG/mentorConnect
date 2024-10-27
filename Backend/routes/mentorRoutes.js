const express = require('express');
const mongoose = require('mongoose');
const Mentor = require('../models/Mentor');  // Import Mentor model
const Tag = require('../models/Tag');       // Import Tag model
const router = express.Router();

// Route to handle mentor search with filters
router.get('/mentors', async (req, res) => {
  try {
    const { searchQuery, skills, jobTitle, company, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Skill filtering: Convert skill names to ObjectIds
    if (skills) {
      const skillNames = skills.split(',');
      const skillTags = await Tag.find({ name: { $in: skillNames } });  // Find skill tags by name
      const skillIds = skillTags.map(tag => tag._id);  // Extract ObjectIds

      // Add skill filter using ObjectIds
      filter.skills = { $in: skillIds };
    }

    // Add jobTitle and company filters if provided
    if (jobTitle) {
      filter.jobTitle = { $in: jobTitle.split(',') };
    }
    if (company) {
      filter.company = { $in: company.split(',') };
    }

    // Search query for name, jobTitle, and company fields
    if (searchQuery) {
      filter.$or = [
        { name: new RegExp(searchQuery, 'i') },
        { jobTitle: new RegExp(searchQuery, 'i') },
        { company: new RegExp(searchQuery, 'i') },
      ];
    }

    // Pagination setup
    const mentors = await Mentor.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('skills', 'name');  // Populate skills field with skill name

    const totalMentors = await Mentor.countDocuments(filter);
    const totalPages = Math.ceil(totalMentors / limit);

    res.status(200).json({
      mentors,
      pagination: {
        currentPage: page,
        totalPages,
        totalMentors,
      },
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
