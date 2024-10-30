const express = require('express');
const mongoose = require('mongoose');
const Mentee = require('../models/Mentee');  // Import Mentee model
const Tag = require('../models/Tag');        // Import Tag model
const Review = require('../models/Review');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const menteeId = req.params.id;

    try {
        const mentee = await Mentee.findById(menteeId)
        .populate({
            path: 'bookedSessions.sessionId',
            select: 'date time mentor status session_type ',
            populate: {
                path: 'mentor',
                model: 'Mentor',
                select: 'name email'
            }
        });

        if (!mentee) {
            return res.status(404).json({
                success: false,
                message: 'Mentee not found',
            });
        }

        const sessionBookedArray = mentee.bookedSessions ? 
            mentee.bookedSessions.map(bookedSession => ({
                mentorName: bookedSession.sessionId.mentor?.name,
                mentorEmail: bookedSession.sessionId.mentor?.email,
                date: bookedSession.date,
                time: bookedSession.time,
            })) : [];

        res.status(200).json({
            success: true,
            message: 'Mentee details retrieved successfully',
            mentee: {
                firstName: mentee.firstName,
                lastName: mentee.lastName,
                email: mentee.email,
                role: mentee.role,
                profilePicture: mentee.profilePicture,
                tags: mentee.tags.map(tag => tag.name),
                bookedSessions: sessionBookedArray,
            },
        });
    } catch (error) {
        console.error("Error retrieving mentee details:", error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred while retrieving mentee details',
        });
    }
});

module.exports = router;
