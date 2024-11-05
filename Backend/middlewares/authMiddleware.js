const jwt = require('jsonwebtoken');
const Mentee = require('../Models/Mentee');
const Mentor = require('../models/Mentor'); // Assuming you have a Mentor model
const { decode } = require('punycode');

// Mentee authentication middleware
const verifyMentee = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "
    console.log(token);
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
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


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET|| 'shhhhhhhhhhhhh', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        
        // Attach user data to the request object
        req.user = decoded;
        console.log(req.user);
        next();
    });
};



// Export both middleware functions
module.exports = {
    verifyMentee,
    verifyMentor,
    verifyToken
};
