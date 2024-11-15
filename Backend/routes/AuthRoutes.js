const express = require('express');
const router = express.Router();
const { signUpMentee, signUpMentor, loginController , googleAuth ,googleAuthCallback,generateOtp} = require('../controllers/Auth');
const PasswordHandler = require('../controllers/PasswordHandler');
const { verifyMentee, verifyToken } = require('../middlewares/authMiddleware');

router.post('/signUpMentee', signUpMentee);
router.post('/signUpMentor', signUpMentor);
router.post('/login', loginController);
router.post('/generateOtp',generateOtp);
// Route to change the password with old password
router.post('/change-password', PasswordHandler.changePassword);
// Route to send reset password email
router.post('/send-reset-password-email', PasswordHandler.sendResetPasswordEmail);
// Route to reset the password using URL token
router.post('/reset-password/:token', PasswordHandler.resetPassword);
router.get('/google-check',verifyMentee,(req,res)=>{
    res.status(200).json({
        data:req.mentee,
        msg:"success"
    })
})
module.exports = router;