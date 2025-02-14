const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const MentorModel = require('../Models/Mentor'); 
const MenteeModel = require('../Models/Mentee');
const Community = require('../Models/Community');
const Tag=require('../Models/Tag');
require("dotenv").config();
const { uploadImageToCloudinary } = require("../config/cloudinary");
const Otp = require('../Models/OTP');
const mailSender = require('../utils/mailSender');

// Generate and send OTP
exports.generateOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Set expiry to 3 minutes from now
    const expiry = new Date(Date.now() + 3 * 60 * 1000);

    // Save OTP in the database
    await Otp.create({ email, otp, expiry });

    // Send OTP via email
    const title = 'Your MentorConnect OTP';
    const body = `<p>Your OTP for signup is <strong>${otp}</strong>. It is valid for 3 minutes.</p>`;
    await mailSender(email, title, body);

    return res.status(200).json({ success: true, message: 'OTP sent to email successfully.' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    return res.status(500).json({ success: false, message: 'Error sending OTP.' });
  }
};



// signup controller for mentee
exports.signUpMentee = async (req, res) => {
  try {
    const { firstName, lastName, email, password, jobTitle, company, location, bio, summary, otp } = req.body;
    const profilePicture = req.files?.profilePicture;

    // Check if the mentee already exists
    const existingMentee = await MenteeModel.findOne({ email });
    if (existingMentee) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Check for the latest OTP
    const latestOtpRecord = await Otp.findOne({ email }).sort({ expiry: -1 });
    if (!latestOtpRecord) {
      return res.status(400).json({ success: false, message: 'OTP not found. Please request a new one.' });
    }

    // Validate the OTP
    console.log("db otp -> ", latestOtpRecord.otp)
    console.log("frontend otp -> ", otp)
    console.log("new date -> ", new Date());
    console.log("expiry time -> ",latestOtpRecord.expiry)
    if (latestOtpRecord.otp !== otp || new Date() > latestOtpRecord.expiry) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // Delete the OTP after successful validation
    await Otp.deleteOne({ _id: latestOtpRecord._id });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload profile picture to Cloudinary
    let imageUrl = null;
    if (profilePicture) {
      const image = await uploadImageToCloudinary(profilePicture, process.env.FOLDER_NAME);
      imageUrl = image.secure_url;
    }

    // Create the new mentee
    const newMentee = await MenteeModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePicture: imageUrl, // Optional profile picture
      jobTitle,
      company,
      location,
      bio,
      summary,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newMentee._id, role: 'mentee', email: newMentee.email },
      process.env.JWT_SECRET
    );

    // Set the JWT in a cookie
    res.cookie('token', token, {
      httpOnly: true,
    });

    // Clear password before sending response
    newMentee.password = null;

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      user: {
        id: newMentee._id,
        firstName: newMentee.firstName,
        lastName: newMentee.lastName,
        email: newMentee.email,
        profilePicture: newMentee.profilePicture,
        jobTitle: newMentee.jobTitle,
        company: newMentee.company,
        location: newMentee.location,
        bio: newMentee.bio,
        summary: newMentee.summary,
      },
      token,
      role: 'mentee',
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.signUpMentor = async (req, res) => {
  try {
    console.log("req.body ", req.body);
    console.log("req.files ", req.files);

    const { name, email, password, bio, jobTitle, company, location, summary, skills, otp } = req.body;
    const profilePicture = req.files?.profilePicture;

    // Check if profile picture is provided
    if (!profilePicture) {
      return res.status(400).json({
        success: false,
        message: 'Profile picture is required.',
      });
    }

    // Check if the mentor already exists
    const existingMentor = await MentorModel.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Check for the latest OTP
    const latestOtpRecord = await Otp.findOne({ email }).sort({ expiry: -1 });
    if (!latestOtpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new one.',
      });
    }

    // Validate the OTP
    console.log("db otp -> ", latestOtpRecord.otp)
    console.log("frontend otp -> ", otp)
    console.log("new date -> ", new Date());
    console.log("expiry time -> ",latestOtpRecord.expiry)
    if (latestOtpRecord.otp !== otp || new Date() > latestOtpRecord.expiry) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP.',
      });
    }

    // Delete the OTP after successful validation
    await Otp.deleteOne({ _id: latestOtpRecord._id });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Process skills
    let skillIds = [];
    const s = skills.split(','); // Split the Skills string to make an array of strings
    for (const skillName of s) {
      let tag = await Tag.findOne({ name: skillName });
      if (!tag) {
        // If tag not found, create a new one
        tag = await Tag.create({ name: skillName, associated_users: [] });
      }
      skillIds.push(tag._id); // Store the tag id
    }

    // Upload profile picture to Cloudinary
    const image = await uploadImageToCloudinary(profilePicture, process.env.FOLDER_NAME);

    // Create mentor using 'create' method
    const newMentor = await MentorModel.create({
      name,
      email,
      password: hashedPassword,
      bio,
      jobTitle,
      company,
      location,
      summary,
      profilePicture: image.secure_url, // Mandatory profile picture
      skills: skillIds,
    });

    // Add Mentor to Skill Tags
    for (const skillName of s) {
      let tag = await Tag.findOne({ name: skillName });
      tag.associated_users.push(newMentor._id); // Add mentor's id to tag's associated_users
      await tag.save();
    }

    // Create a default community for the new mentor
    const defaultCommunity = await Community.create({
      mentor_id: newMentor._id,
      mentees: [],
      communityPosts: [],
    });
    console.log(defaultCommunity);

    // Update mentor document with community reference
    newMentor.community = defaultCommunity._id;
    await newMentor.save();

    // Generate JWT token
    const token = jwt.sign({ id: newMentor._id, role: 'mentor', email: newMentor.email }, process.env.JWT_SECRET);

    // Set cookie with the JWT token
    res.cookie('token', token, {
      httpOnly: true,
    });

    newMentor.password = null;

    // Send response
    res.status(201).json({
      success: true,
      message: 'Signup successful',
      mentor: newMentor,
      token,
      role: "mentor",
    });
  } catch (error) {
    console.error("signup error :", error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// login controller for both mentor mentee
exports.loginController = async (req, res) => {
  const { email, password, role } = req.body;
  console.log(req.body)
  try {
    // Determine the correct model based on the role
    const UserModel = role === 'mentor' ? MentorModel : MenteeModel;

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success:false,
        message: 'User not found'
     });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success:false,
        message: 'Invalid password'
     });
    }

    // Create JWT payload and sign the token
    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET,
    );

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
    });
    user.password=null;
    // Send success response
    res.status(200).json({ 
      success:true,
      message: `${role} login successful`,
      token ,
      role,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success:false,
      message: 'Internal server error'
     });
  }
};

exports.logoutController = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
  });

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};
