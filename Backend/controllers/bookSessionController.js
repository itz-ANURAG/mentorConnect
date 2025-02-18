const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
const Mentor = require('../Models/Mentor');
const Mentee = require('../Models/Mentee');
const Session = require('../Models/Session');
require('dotenv').config();

// Helper function to find available slot index
const findSlotIndex = (slots, date, time) => {
    return slots.findIndex(
        slot => slot.date.toISOString() === new Date(date).toISOString() && slot.time === time
    );
};
const bookSessionController = async (req, res) => {
  const FRONTEND_URL=process.env.FRONTEND_URL
  try {
    const { date, time, mentorId, menteeId } = req.body;
    // Check for missing required fields
    if (!date || !time || !mentorId || !menteeId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Fetch mentor and mentee details
    const mentor = await Mentor.findById(mentorId);
    const mentee = await Mentee.findById(menteeId);

    if (!mentor || !mentee) {
      return res.status(404).json({ message: 'Mentor or mentee not found.' });
    }

    const mentorEmail = mentor.email;
    const menteeEmail = mentee.email;

    // Check slot availability
        const slotIndex = findSlotIndex(mentor.freeSlots, date, time);
        if (slotIndex === -1) {
            return res.status(400).json({ success: false, message: 'Selected slot is not available' });
        }

        
        // Parse date and time
        // Assuming date is in the format "2024-11-21T00:00:00.000Z"
        const meetingDate = new Date(date); // Directly parse 'date' without concatenating time
        
        if (isNaN(meetingDate.getTime())) {
          return res.status(400).json({ message: 'Invalid date format.' });
        }
        
        // Create a new session
            const newSession = new Session({
                mentor: mentorId,
                mentee: menteeId,
                date,
                time,
                status: 'upcoming',
                session_type:'one-on-one',
            });
      
            // Update mentor's freeSlots and upcomingSessions
            mentor.freeSlots.splice(slotIndex, 1);
            mentor.upcomingSessions.push({ sessionId: newSession._id, date, time });
            await Promise.all([mentor.save(), newSession.save()]);

    // Calculate expiration time for JWT token
    const expirationDate = new Date(meetingDate.getTime() + 60 * 60 * 1000*60); // 1 hour after meeting
    const tokenPayload = { mentorId, menteeId, sessionId:newSession._id , exp: Math.floor(expirationDate.getTime() / 1000) };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    const safeToken = token.replace(/\./g, '*');

    // Define the meeting URL
    const menteeUrl = `${FRONTEND_URL}video/join/${safeToken}?role=mentee&name=${encodeURIComponent(mentee.firstName)}`;
    const mentorUrl = `${FRONTEND_URL}video/join/${safeToken}?role=mentor&name=${encodeURIComponent(mentor.name)}`;


    // Send email to mentee
    mailSender(
      menteeEmail,
      'MentorConnect Meeting Slot Confirmation',
      `<p>Hello,</p>
      <p>Your mentorship session is confirmed!</p>
      <p><strong>Meeting Details:</strong></p>
      <p>Date: ${expirationDate.toLocaleString()}</p>
      <p>Join the meeting at your scheduled time:</p>
      <a href="${menteeUrl}">Join Meeting</a>
      <p>Best Regards,<br>MentorConnect Team</p>`
    ).then(() => console.log('Email sent to mentee.'))
     .catch(err => console.error('Error sending email to mentee:', err));

    // Send email to mentor
    mailSender(
      mentorEmail,
      'MentorConnect Meeting Scheduled',
      `<p>Hello,</p>
      <p>Your mentorship session has been scheduled.</p>
      <p><strong>Meeting Details:</strong></p>
      <p>Date: ${meetingDate.toLocaleString()}</p>
      <p>Join the session here:</p>
      <a href="${mentorUrl}">Join Meeting</a>
      <p>Best Regards,<br>MentorConnect Team</p>`
    ).then(() => console.log('Email sent to mentor.'))
     .catch(err => console.error('Error sending email to mentor:', err));

    // Send success response with the token to the frontend
    res.status(200).json({ message: 'Meeting scheduled successfully.', token });

  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({ message: 'An error occurred while scheduling the meeting.' });
  }
};

module.exports = bookSessionController;
