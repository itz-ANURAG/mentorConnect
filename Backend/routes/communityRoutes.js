const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Community = require('../models/Community');
const { verifyToken } = require('../middlewares/authMiddleware'); // Assuming you have a token verification middleware

router.get('/:mentorId/check-mentee/:menteeId', verifyToken, async (req, res) => {
  const { mentorId, menteeId } = req.params;

  try {
    // Find the community by mentorId
    const community = await Community.findOne({ mentor_id: mentorId });

    // If the community doesn't exist, return an error
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if the menteeId is in the mentees array
    const isMember = community.mentees.includes(menteeId);

    // Send the response indicating membership status
    res.json({ isMember });
  } catch (error) {
    res.status(500).json({ message: 'Error checking community membership', error });
  }
});



// Route to check and join a community
router.get('/:mentorId/check-join', verifyToken, async (req, res) => {
    const { mentorId } = req.params;
  const menteeId = req.user.id; // Assume `verifyToken` middleware attaches user info to `req`

  try {
    // Find the community for this mentor
    let community = await Community.findOne({ mentor_id: mentorId });

    if (!community) {
      return res.status(404).json({ message: "Community not found for this mentor", joined: false });
    }
    // Check if mentee is already in the community
    const isMenteeInCommunity = community.mentees.includes(menteeId);

    if (isMenteeInCommunity) {
      return res.status(200).json({ message: "Already in community", joined: true });
    } else {
      // Add mentee to the community
      community.mentees.push(menteeId);
        await community.save();
        console.log("Mentee added to community:", community.mentees);
      return res.status(200).json({ message: "Joined community successfully", joined: true });
    }
  } catch (error) {
    console.error("Error in joining community:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
