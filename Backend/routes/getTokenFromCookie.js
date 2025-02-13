const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import your user models
const MentorModel = require('../Models/Mentor'); 
const MenteeModel = require('../Models/Mentee');

const JWT_SECRET = process.env.JWT_SECRET;

// GET {backend-url}/retrieve/getToken -> Decodes token from cookie and returns user info
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
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Failed to authenticate token",
      });
    }
    
    try {
      // Choose the correct model based on the user's role
      const UserModel = decoded.role === 'mentor' ? MentorModel : MenteeModel;
      // Fetch the user document from the database using decoded id.
      // .select("-password") omits the password field.
      const user = await UserModel.findById(decoded.id).select("-password");
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      // Respond with the token, role, and the user document (without password)
      res.status(200).json({
        success: true,
        token,           // original token (optional)
        role: decoded.role,
        user,   // full user document from DB without password
      });
    } catch (dbError) {
      console.error("Error fetching user:", dbError);
      res.status(500).json({
        success: false,
        message: "Error retrieving user from database"
      });
    }
  });
});

module.exports = router;
