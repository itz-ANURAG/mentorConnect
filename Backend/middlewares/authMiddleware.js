const jwt = require('jsonwebtoken');
const Mentee = require('../models/Mentee'); 
const Mentor = require('../models/Mentor'); 
require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET; // Secret key for JWT verification.

// Middleware for verifying Mentee authentication.
const verifyMentee = async (req, res, next) => {
    // Extract the token from the Authorization header.
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer ".

    if (!token) {
        // Return error if no token is provided.
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if the user exists as a registered mentee.
        const mentee = await Mentee.findById(decoded.id);
        req.mentee = mentee; // Attach mentee info to the request object.

        if (!mentee) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not a mentee.'
            });
        }

        // Proceed to the next middleware or route handler.
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(400).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

// Middleware for verifying Mentor authentication.
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
        const decoded = jwt.verify(token, JWT_SECRET);
        req.mentor = decoded;

        // Check if the user exists as a registered mentor.
        const mentor = await Mentor.findById(decoded.id);
        if (!mentor) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Not a mentor.'
            });
        }

        // Proceed to the next middleware or route handler.
        next();
    } catch (error) {
        // Handle errors during token verification.
        console.error('Token verification failed:', error);
        res.status(400).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

// Middleware for verifying a generic token.
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Verify the token using the secret key.
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded;
        console.log("Req.user value:", req.user); 
        next();
    });
};

// Export all middleware functions for use in other parts of the application.
module.exports = {
    verifyMentee,
    verifyMentor,
    verifyToken
};
