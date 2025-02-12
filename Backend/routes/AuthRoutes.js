// Import necessary modules and dependencies.
const express = require('express');
const router = express.Router();
const {
    signUpMentee,
    signUpMentor,
    loginController,
    logoutController,
    generateOtp
} = require('../controllers/Auth'); // Import authentication-related controllers.
const PasswordHandler = require('../controllers/PasswordHandler'); // Import password-related handlers.
const { verifyMentee } = require('../middlewares/authMiddleware'); // Import authentication middlewares.

// Route for mentee sign-up.
router.post('/signUpMentee', signUpMentee);

// Route for mentor sign-up.
router.post('/signUpMentor', signUpMentor);

// Route for user login.
router.post('/login', loginController);

// Route for user logout.
router.post('/logout', logoutController);

// Route to generate an OTP.
router.post('/generateOtp', generateOtp);

// Route to change the user's password using the old password.
router.post('/change-password', PasswordHandler.changePassword);

// Route to send a reset password email.
router.post('/send-reset-password-email', PasswordHandler.sendResetPasswordEmail);

// Route to reset the password using a token from the reset URL.
router.post('/reset-password/:token', PasswordHandler.resetPassword);

// Route to verify Mentee token and return mentee data.
router.get('/google-check', verifyMentee, (req, res) => {
    res.status(200).json({
        data: req.mentee,
        msg: "success"
    });
});

// Export the router to be used in the main application.
module.exports = router;
