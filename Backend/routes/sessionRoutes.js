const express = require('express');
const router = express.Router();
const Mentor = require('../Models/Mentor');
const Session = require('../Models/Session');
const Mentee = require('../Models/Mentee');
const mailSender = require('../utils/mailSender');
const {verifyMentee,verifyMentor}= require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
const Review = require('../Models/Review'); 

// Helper function to find available slot index
const findSlotIndex = (slots, date, time) => {
    return slots.findIndex(
        slot => slot.date.toISOString() === new Date(date).toISOString() && slot.time === time
    );
};

// Route to book a session with a mentor
router.post('/:mentorId/book', verifyMentee, async (req, res) => {
    const { date, time, session_type } = req.body;
    const { mentorId } = req.params;
    const menteeId = req.mentee.id;

    try {
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ success: false, message: 'Mentor not found' });
        }

        // Check slot availability
        const slotIndex = findSlotIndex(mentor.freeSlots, date, time);
        if (slotIndex === -1) {
            return res.status(400).json({ success: false, message: 'Selected slot is not available' });
        }

        // Create a new session
        const newSession = new Session({
            mentor: mentorId,
            mentee: menteeId,
            date,
            time,
            status: 'upcoming',
            session_type,
        });

        // Update mentor's freeSlots and upcomingSessions
        mentor.freeSlots.splice(slotIndex, 1);
        mentor.upcomingSessions.push({ sessionId: newSession._id, date, time });
        await Promise.all([mentor.save(), newSession.save()]);

        // Send confirmation email to mentee
        const mentee = await Mentee.findById(menteeId);
        mentee.bookedSessions.push({ sessionId: newSession._id, date, time });
        await mentee.save();
        if (mentee) {
            mailSender(
                mentee.email,
                "Session Booked",
                `<p>Your session with Mentor ${mentor.name} is confirmed for ${date} at ${time}.</p>`
            );
        }

        res.status(201).json({
            success: true,
            message: 'Session booked successfully',
            session: newSession,
        });
    } catch (error) {
        console.error('Error booking session:', error.message);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});


router.get('/:mentorId/sessions', verifyMentor, async (req, res) => {
    const { mentorId } = req.params;

    try {
        const mentor = await Mentor.findById(mentorId)
            .populate({
                path: 'upcomingSessions.sessionId',
                select: 'date time mentee status session_type',
                populate: {
                    path: 'mentee',
                    model: 'Mentee',
                    select: 'firstName lastName email',
                },
            });

        if (!mentor) {
            return res.status(404).json({ success: false, message: 'Mentor not found' });
        }

        const sessions = mentor.upcomingSessions.map((session) => ({
            sessionId: session.sessionId?._id,
            menteeId: session.sessionId?.mentee?._id,
            menteeName: `${session.sessionId?.mentee?.firstName || ''} ${
                session.sessionId?.mentee?.lastName || ''
            }`,
            menteeEmail: session.sessionId?.mentee?.email,
            date: session.sessionId?.date,
            time: session.sessionId?.time,
            sessionType: session.sessionId?.session_type,
            status: session.sessionId?.status,
            isBlocked: mentor.blockedMentees.includes(session.sessionId?.mentee?._id)
        }));

        res.status(200).json({ success: true, data: sessions });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sessions' });
    }
});

// Route to block a mentee
router.put('/manageSession/block-mentee', async (req, res) => {
    const { sessionId, menteeId} = req.body;
    console.log("sessionId", sessionId);
    console.log("menteeId", menteeId);
    if (!sessionId || !menteeId) {
        return res.status(400).json({ message: 'Required data missing' });
    }

    try {
        // Find the mentor

        const session = await Session.findById(sessionId);
        if (!session) { return res.status(400).json({ message: 'Session not found' }); }
        const mentor = await Mentor.findById(session.mentor);
        console.log("mentorId", mentor);
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        // Check if mentee is already in blockedMentees
        if (mentor.blockedMentees.includes(menteeId)) {
            return res.status(400).json({ message: 'Mentee has already been blocked' });
        }

        // Add menteeId to blockedMentees array
        mentor.blockedMentees.push(menteeId);
        await mentor.save();

        res.status(200).json({ message: 'Mentee blocked successfully', blockedMentees: mentor.blockedMentees  });
    } catch (error) {
        console.error('Error blocking mentee:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Unblock a mentee
router.put('/manageSession/unblock-mentee', verifyMentor, async (req, res) => {
    const { menteeId } = req.body;

    if (!menteeId) {
        return res.status(400).json({ message: 'Required data missing' });
    }

    try {
        const mentor = await Mentor.findOne({ blockedMentees: menteeId });
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found or mentee not blocked' });
        }

        mentor.blockedMentees = mentor.blockedMentees.filter((id) => id.toString() !== menteeId);
        await mentor.save();

        res.status(200).json({ message: 'Mentee unblocked successfully', blockedMentees: mentor.blockedMentees });
    } catch (error) {
        console.error('Error unblocking mentee:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Cancel a session // let remain authentication of mentor for now!
router.delete('/:mentorId/cancel-session/:sessionId', async (req, res) => {
  const { mentorId, sessionId } = req.params;
  try {
      // Remove the session from the mentor's upcoming sessions
      const mentor = await Mentor.findByIdAndUpdate(mentorId, {
          $pull: { upcomingSessions: { sessionId } }
      });

      // Find and delete the session document itself
      const session = await Session.findByIdAndDelete(sessionId);

      // Find the mentee and remove the session from their booked sessions
      const mentee = await Mentee.findByIdAndUpdate(session.mentee, {
          $pull: { bookedSessions: { sessionId } }
      });

      // Send cancellation email to the mentee
      mailSender(
          mentee.email,
          "Session Cancelled",
          `<p>Your session with Mentor ${mentorId} on ${session.date} has been cancelled.</p>`
      );

      res.status(200).json({ success: true, message: 'Session cancelled successfully' });
  } catch (error) {
      console.error('Failed to cancel session:', error);
      res.status(500).json({ success: false, message: 'Failed to cancel session' });
  }
});

// Route to submit feedback for a mentor
router.post('/feedback/:token', async (req, res) => {
    const { safeToken } = req.params; // Extract the safeToken from the request parameters
    const { message, rating } = req.body; // Extract message and rating from the request body
  
    try {
      // Replace underscores with dots to decode the safeToken
      const token = safeToken.replace(/_/g, '.');
  
      // Decode the JWT to get mentorId and menteeId
      try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const { mentorId, menteeId } = decoded;
  
      // Validate decoded token data
      if (!mentorId || !menteeId) {
        return res.status(400).json({ message: 'Invalid token data' });
      }
  
      // Create a new review
      const review = await Review.create({
        message,
        rating,
        reviewer: menteeId, // Set the mentee ID as the reviewer
      });
  
      // Update the mentor's reviews array by pushing the new review's ID
      const mentor = await Mentor.findOneAndUpdate(
        { _id: mentorId },
        { $push: { reviews: review._id } },
        { new: true } // Return the updated document
      );
  
      if (!mentor) {
        return res.status(404).json({ message: 'Mentor not found' });
      }
  
      // Send a success response
      res.status(200).json({ message: 'Feedback submitted successfully', review });
    }catch(err){
    console.error('Error submitting feedback:', error.message);
      res.status(500).json({ message: 'Session token expired skip feedback for now.', error: error.message });
    }} 
catch (error) {
      console.error('Error submitting feedback:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
  

router.put('/session-complete/:safeToken', async (req, res) => {
    const { safeToken } = req.params;

    if (!safeToken) {
        return res.status(400).json({ message: 'Token is missing' });
    }

    try {
        // Decode the safeToken
        console.log('Received safeToken:', safeToken);
        const token = safeToken.replace(/\*/g, '.');
        console.log('Formatted token:', token);

        // Verify the JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token payload:', decoded);

        const { sessionId } = decoded;

        // Find the session by ID and update its status
        const updatedSession = await Session.findByIdAndUpdate(
            sessionId,
            { status: 'completed' },
            { new: true } // Return the updated document
        );

        if (!updatedSession) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.status(200).json({
            message: 'Session status updated to completed',
            session: updatedSession,
        });
    } catch (error) {
        console.error('JWT Error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token format' });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Route to block a mentee and update session status
router.put('/block/:safeToken', async (req, res) => {
    const { safeToken } = req.params;

    try {
        const token = safeToken.replace(/\*/g, '.');
        // Decode the safe token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
        const { sessionId, mentorId, menteeId } = decoded;

        if (!sessionId || !mentorId || !menteeId) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }

        // Find the session and update its status to "completed"
        const session = await Session.findByIdAndUpdate(
            sessionId,
            { status: 'completed' },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Find the mentor and add the mentee to the blockedMentees array
        const mentor = await Mentor.findById(mentorId);

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        if (!mentor.blockedMentees.includes(menteeId)) {
            mentor.blockedMentees.push(menteeId);
            await mentor.save();
        }

        res.status(200).json({
            message: 'Mentee has been blocked and session status updated to completed',
            session,
            mentor: {
                id: mentor._id,
                blockedMentees: mentor.blockedMentees,
            },
        });
    } catch (error) {
        console.error('Error blocking mentee:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;