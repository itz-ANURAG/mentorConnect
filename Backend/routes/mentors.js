// In your Express app (e.g., app.js or routes/mentors.js)
const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor'); // Adjust path as needed

// Route to get all mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find(); // Retrieve all mentors
    res.json(mentors); // Send the mentors data as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;