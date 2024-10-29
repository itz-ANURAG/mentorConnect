const express = require('express');
const router = express.Router();
const { verifyMentor } = require('../middlewares/authMiddleware');
const Mentor = require('../models/Mentor');

// Route to get slots (already available)
router.get('/:mentorId/free-slots', verifyMentor, async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.mentorId);
        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor not found',
            });
        }
        res.status(200).json({ success: true, data: mentor.freeSlots });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch slots' });
    }
});

// Route to add a slot
router.post('/:mentorId/free-slots', verifyMentor, async (req, res) => {
    const { date, time } = req.body;
    try {
        const mentor = await Mentor.findById(req.params.mentorId);
        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor not found',
            });
        }
        const newSlot = { date: new Date(date), time }; // Ensure date is a Date object
        mentor.freeSlots.push(newSlot);
        await mentor.save();
        res.status(201).json({ success: true, data: mentor.freeSlots });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add slot' });
    }
});

// Route to update a slot
router.put('/:mentorId/free-slots/:slotId', verifyMentor, async (req, res) => {
    const { date, time } = req.body;
    try {
        const mentor = await Mentor.findById(req.params.mentorId);
        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor not found',
            });
        }
        const slot = mentor.freeSlots.id(req.params.slotId);
        if (!slot) {
            return res.status(404).json({ success: false, message: 'Slot not found' });
        }
        slot.date = new Date(date); // Ensure date is a Date object
        slot.time = time;
        await mentor.save();
        res.status(200).json({ success: true, data: mentor.freeSlots });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update slot' });
    }
});

// Route to delete a slot
router.delete('/:mentorId/free-slots/:slotId', verifyMentor, async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.mentorId);
        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Mentor not found',
            });
        }

        const slotId = req.params.slotId;
        const slot = mentor.freeSlots.id(slotId);
        if (!slot) {
            return res.status(404).json({ success: false, message: 'Slot not found' });
        }

        console.log("Deleting Slot ID:", slotId);
        console.log("Mentor Free Slots Before Deletion:", mentor.freeSlots);

        // Using the pull method // DONt use slot.remove()!!
        mentor.freeSlots.pull(slotId); // Remove the slot from the array
        await mentor.save(); // Save the updated mentor document

        console.log("Updated Mentor Free Slots:", mentor.freeSlots);
        res.status(200).json({ success: true, data: mentor.freeSlots });
    } catch (err) {
        console.error("Error Deleting Slot:", err); // Log the error for more details
        res.status(500).json({ success: false, message: 'Failed to delete slot', error: err.message });
    }
});

module.exports = router;
