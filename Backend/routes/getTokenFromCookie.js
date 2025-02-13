const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Make sure you have your secret in your environment variables or config file.
const JWT_SECRET = process.env.JWT_SECRET;

// GET /auth/me - Decodes token from cookie and returns user info
router.get("/getToken", (req, res) => {
  // Retrieve the token from the 'token' cookie
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "No token provided",
    });
  }
  
  // Verify and decode the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Failed to authenticate token",
      });
    }
    
    // Respond with decoded token data (customize as needed)
    res.status(200).json({
      success: true,
      token,           // original token (optional)
      role: decoded.role,
      user: decoded,   // full decoded payload; you might want to filter this
    });
  });
});

// Export the router to be used in the main application.
module.exports = router;
