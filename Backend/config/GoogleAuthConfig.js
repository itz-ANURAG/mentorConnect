let express = require('express');
let router = express.Router();
let passport = require('passport');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const mentee = require('../models/Mentee'); 
let GoogleStrategy = require('passport-google-oauth2').Strategy; // Google OAuth2 Strategy.

// Extract Google OAuth credentials from environment variables.
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK = process.env.CALLBACK_URL;

// Configure Passport.js to use Google OAuth2 strategy.
passport.use(new GoogleStrategy(
    {
        clientID: CLIENT_ID,             
        clientSecret: CLIENT_SECRET,      
        callbackURL: CALLBACK,            // Callback URL after authentication.
        scope: ['profile', 'email'],      // Scopes to request user profile and email.
        passReqToCallback: true           // Pass the request object to the callback.
    },
    async function (request, accessToken, refreshToken, profile, done) {

        // Check if the user already exists in the database.
        let data = await mentee.findOne({ email: profile.email });
        let user;

        if (!data) {
            // If user doesn't exist, create a new mentee document.
            user = new mentee({
                firstName: profile.displayName, 
                email: profile.email           
            });
            await user.save(); // Save the new user to the database.
            console.log("google saved");
            return done(null, user); // Pass the new user to Passport.
        } else {
            // If user exists, log the message and return the user.
            console.log("already registered user");
            return done(null, data);
        }
    }
));

// Route to initiate Google authentication.
router.get('/googleAuth',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Route to handle redirection after Google authentication.
router.get('/google', (req, res) => {
    try {
        // Generate a JWT token for the authenticated user.
        const token = jwt.sign({
            email: req.user.email,  
            id: req.user._id         
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Replace dots with asterisks for token safety in URLs.
        const modifyToken = token.replace(/\./g, '*');

        // Set the token as an HTTP-only cookie and redirect to the frontend.
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.redirect(`${process.env.FRONTEND_URL}/google-callback/${modifyToken}`);
    } catch (error) {
        console.log(error);
        res.redirect(`${process.env.FRONTEND_URL}/signUpMentee`);
    }
});

// Callback route after Google authentication.
router.get('/googleAuth/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google',                  
        failureRedirect: 'http://localhost:5173/signUpMentee'
    })
);

module.exports = router;
