// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Mentee = require('../models/Mentee');

const verifyMentee = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "
  if (!token) return res.status(401).json({ message: 'Access denied. No  token provided.' ,
    success:false,
  });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET||'shhhhhhhhhhhhh');
    console.log('Decoded token:', decoded); // Temporary log
    req.mentee = decoded; // Attach mentee info to request
    
    // Check if the user is a registered mentee
    const mentee = await Mentee.findById(decoded.id);
    if (!mentee) return res.status(403).json({ 
        success:false,
        message: 'Access denied. Not a mentee.' 
    });
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(400).json({ 
        success:false,
        message: 'Invalid token.' });
  }
};

module.exports = verifyMentee;
