const express = require('express');
const mongoose = require('mongoose');
const Mentee = require('../models/Mentee');  // Import Mentee model
const Tag = require('../models/Tag');        // Import Tag model
const Review = require('../models/Review');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const menteeId = req.params.id; // Extract the mentee ID from the URL parameters

    try {
        // Find the mentee by their ID and populate the bookedSessions field with session details
        const mentee = await Mentee.findById(menteeId)
        .populate({
            path: 'bookedSessions.sessionId', // Populate the sessionId field in bookedSessions
            select: 'date time mentor status session_type', // Only select relevant fields from session
            populate: {
                path: 'mentor', // Also populate mentor details
                model: 'Mentor', // Specify the Mentor model to be populated
                select: 'name email' // Only select name and email for the mentor
            }
        });

        // Check if the mentee exists in the database
        if (!mentee) {
            return res.status(404).json({
                success: false,
                message: 'Mentee not found', // Return a 404 if mentee is not found
            });
        }

        // If mentee exists, map the bookedSessions to a simpler structure for the response
        const sessionBookedArray = mentee.bookedSessions ? 
            mentee.bookedSessions.map(bookedSession => ({
                mentorName: bookedSession.sessionId.mentor?.name,
                mentorEmail: bookedSession.sessionId.mentor?.email,
                date: bookedSession.date, 
                time: bookedSession.time,
            })) : []; // If no bookedSessions, return an empty array

        // Send the response with mentee details, including first and last name, email, profile picture, and booked sessions
        res.status(200).json({
            success: true,
            message: 'Mentee details retrieved successfully',
            mentee: {
                firstName: mentee.firstName, 
                lastName: mentee.lastName, 
                email: mentee.email, 
                role: mentee.role, 
                profilePicture: mentee.profilePicture, // Mentee's profile picture URL
                tags: mentee.tags.map(tag => tag.name),
                bookedSessions: sessionBookedArray, 
            },
        });
    } catch (error) {
        console.error("Error retrieving mentee details:", error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred while retrieving mentee details', // Return a generic error message
        });
    }
});

module.exports = router; 
