const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const MentorModel = require('../models/Mentor');
const MenteeModel = require('../models/Mentee');
const mailSender=require('../utils/mailSender');
require('dotenv').config();

exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, role } = req.body;

    // Determine the correct model based on the role
    const UserModel = role === 'mentor' ? MentorModel : MenteeModel;

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Compare the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Old password is incorrect' 
      });
    }

    // // Validate new password and confirmation
    // if (newPassword !== newConfirmPassword) {
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: 'New password and confirmation do not match' 
    //   });
    // }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password using findOneAndUpdate
    await UserModel.findOneAndUpdate(
      { email }, 
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Send Reset Password Email
exports.sendResetPasswordEmail = async (req, res) => {
  try {
    const { email, role } = req.body;
    console.log(email)
    console.log(role)
    // Check if user exists
    const UserModel = role === 'mentor' ? MentorModel : MenteeModel;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate a reset token (valid for 15 minutes)
    const token = jwt.sign({ email: user.email, role: role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const safeToken = token.replace(/\./g, '-');

    // Create a reset URL
    const resetUrl = `${process.env.FRONTEND_URL}reset-password/${safeToken}`;


    mailSender(email,'Password Reset Request',`<p>Please use the following link to reset your password:</p><a href="${resetUrl}">Reset Password</a>`);
    
   
    res.status(200).json({
      success: true,
      message: 'Reset password email sent successfully'
    });
  } catch (error) {
    console.error('Error sending reset password email:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    const jwtToken = token.replace(/-/g, '.');
    // Verify token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const UserModel = decoded.role === 'mentor' ? MentorModel : MenteeModel;

    // Ensure passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password using findOneAndUpdate
    await UserModel.findOneAndUpdate(
      { email: decoded.email },
      { password: hashedPassword }
    );

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
