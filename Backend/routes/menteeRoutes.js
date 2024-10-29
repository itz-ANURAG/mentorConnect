const express = require('express');
const mongoose = require('mongoose');
const Mentee = require('../models/Mentee');  // Import Mentee model
const Tag = require('../models/Tag');        // Import Tag model
const Review = require('../models/Review');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const menteeId = req.params.id;

    try {
        const mentee = await Mentee.findById(menteeId);
        console.log(mentee);
            

        if (!mentee) {
            return res.status(404).json({
                success: false,
                message: 'Mentee not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Mentee details retrieved successfully',
            mentee: {
                firstName: mentee.firstName,
                lastName: mentee.lastName,
                email: mentee.email,
                role: mentee.role,
                profilePic: mentee.profilePic,
                tags: mentee.tags.map(tag => tag.name),
                bookedSessions: mentee.bookedSessions.map(bookedSession =>bookedSession.name),
                
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
