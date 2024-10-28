const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const verifyMentee = require('../middlewares/authMiddleware');

// Book a session
router.post('/:mentorId/book', verifyMentee, async (req, res) => {
  const { date, time, session_type } = req.body;

  try {
    // Check if the mentor has this slot available
    const mentor = await Mentor.findById(req.params.mentorId);
    const slotIndex = mentor.freeSlots.findIndex(slot => 
      slot.date.toISOString() === new Date(date).toISOString() && slot.time === time
    );

    if (slotIndex === -1) {
      return res.status(400).json({ 
        success: false,
        message: 'Selected slot is not available' 
      });
    }

    // Create a new session
    const session = new Session({
      mentor_id: req.params.mentorId,
      mentee_id: req.mentee.id,
      date,
      time,
      status: 'upcoming',
      session_type
    });

    // Remove the booked slot from the mentor's freeSlots array
    mentor.freeSlots.splice(slotIndex, 1);
    await mentor.save(); // Save mentor after modifying freeSlots
    await session.save(); // Save session after creation

    res.status(201).json({ 
      success: true,
      message: 'Session booked successfully',
      session 
    });
  } catch (error) {
    console.error('Error booking session:', error); // Log the error for debugging
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

module.exports = router;
