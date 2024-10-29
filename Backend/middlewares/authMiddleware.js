const jwt = require('jsonwebtoken');
const Mentee = require('../models/Mentee');
const Mentor = require('../models/Mentor'); // Assuming you have a Mentor model

// Mentee authentication middleware
const verifyMentee = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shhhhhhhhhhhhh');
        req.mentee = decoded; // Attach mentee info to request
        
        // Check if the user is a registered mentee
        const mentee = await Mentee.findById(decoded.id);
        if (!mentee) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Not a mentee.' 
            });
        }
        
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Invalid token.' 
        });
    }
};

// Mentor authentication middleware (example)
const verifyMentor = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shhhhhhhhhhhhh');
        req.mentor = decoded; // Attach mentor info to request
        
        // Check if the user is a registered mentor
        const mentor = await Mentor.findById(decoded.id);
        if (!mentor) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Not a mentor.' 
            });
        }
        
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Invalid token.' 
        });
    }
};

// Export both middleware functions
module.exports = {
    verifyMentee,
    verifyMentor
};
