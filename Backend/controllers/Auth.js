const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const MentorModel = require('../models/Mentor'); 
const MenteeModel = require('../models/Mentee'); 
const Tag=require('../models/Tag');
require("dotenv").config();
const { uploadImageToCloudinary } = require("../config/cloudinary");


// signup controller for mentee
exports.signUpMentee = async (req, res) => {
    try {

      const { firstName, lastName, email, password } = req.body;
      console.log(req.body);
      // Check if the mentee already exists
      const existingMentee = await MenteeModel.findOne({ email });
      if (existingMentee) {
        return res.status(400).json({ 
            success:false,
            message: 'User already exists',
         });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create the new mentee
      const newMentee = await MenteeModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
  
      // Generate JWT token
      const token = jwt.sign(
        { id: newMentee._id, role: 'mentee',email:newMentee.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Set the JWT in a cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
      });
      newMentee.password=null;
      // Return response with success
      res.status(201).json({
        success:true,
        message: 'Signup successful',
        user: {
          id: newMentee._id,
          firstName: newMentee.firstName,
          lastName: newMentee.lastName,
          email: newMentee.email,
        },
        token,
        role:"mentee",
        mentee:newMentee,
      });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ 
        success:false,
        message: 'Server error'
     });
    }
  };

// signup controller for mentor
exports.signUpMentor = async (req, res) => {
    try {
      console.log("req.body ",req.body);
      console.log("req.files ",req.files)
      const { name, email, password, bio, jobTitle, company, location, summary, skills } = req.body;
      const profilePicture = req.files.profilePicture;
      
      // Check if email already exists
      const existingMentor = await MentorModel.findOne({ email });
      if (existingMentor) {
        return res.status(400).json({ 
            success:false,
            message: 'Email already registered'
         });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Process skills
      let skillIds = [];
      const s=skills.split(','); // Split the Skills string to make a Array of string 's'
        for (const skillName of s) {
          let tag = await Tag.findOne({ name: skillName });
          if (!tag) {
            // If tag not found, create a new one
            tag = await Tag.create({ name: skillName, associated_users: [] });
          }
          skillIds.push(tag._id);  // Store the tag id
        }
  
      const image = await uploadImageToCloudinary(profilePicture, process.env.FOLDER_NAME);
      console.log(image);

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
        profilePicture: image.secure_url, 
        skills: skillIds,
      });
  
      // Add Mentor/Mentee to Skill Tags
      for (const skillName of s) {
        let tag = await Tag.findOne({ name: skillName });
        tag.associated_users.push(newMentor._id);  // Add mentor's id to tag's associated_users
        await tag.save();
      }


      // Generate JWT token
      const token = jwt.sign({ id: newMentor._id, role: 'mentor',email:newMentor.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      // Set cookie with the JWT token
      res.cookie('auth_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      newMentor.password=null;
      // Send response
      res.status(201).json({ 
        success:true,
        message: 'Signup successful',
         mentor:newMentor,
         token,
         role:"mentor",
         });
    } catch (error) {
      console.error("signup error :",error);
      res.status(500).json({ 
        success:false,
        message: 'Server error'
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
      { expiresIn: '1d' } // Set the expiration time as needed
    );

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
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
