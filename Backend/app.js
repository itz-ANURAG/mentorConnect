let createError = require('http-errors'); // For creating HTTP errors
let express = require('express'); // Express framework
let cors = require('cors'); // Enables Cross-Origin Resource Sharing
let path = require('path'); // Utility for handling file and directory paths
let cookieParser = require('cookie-parser'); // Parses cookies attached to the client request
let logger = require('morgan'); // HTTP request logger middleware
let app = express(); // Initializes Express app
let passport = require('passport'); // For handling authentication
let expressSession = require('express-session'); // For managing session data
require('dotenv').config();

// Importing route files
let authRoutes = require('./routes/AuthRoutes');
let mentorRoutes = require('./routes/mentorRoutes');
let videoSession = require('./routes/videoSession');
let slotRoutes = require('./routes/slots');
let menteeRoutes = require('./routes/menteeRoutes');
const getTokenFromCookie=require('./routes/getTokenFromCookie');
const sessionRoutes = require('./routes/sessionRoutes');
const profileRoutes = require('./routes/profileRoutes');
const communityRoutes = require('./routes/communityRoutes');
const communityPostRoutes = require('./routes/communityPostRoutes');
const general = require('./routes/generalPost');

// Importing configurations
let google = require('./config/GoogleAuthConfig');
let db = require('./config/db');
db(); // Initialize database connection

// File upload and Cloudinary configuration
const fileupload = require("express-fileupload");
app.use(fileupload({ useTempFiles: true })); // Enables file uploads with temporary file storage
const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect(); // Connects Cloudinary for file management

// Setting up the view engine
app.set('views', path.join(__dirname, 'views')); // Sets the directory for views
app.set('view engine', 'jade'); // Sets Jade as the view engine

// Configuring session middleware
app.use(expressSession({
  resave: false, // Prevents unnecessary session save
  saveUninitialized: false, // Prevents saving uninitialized sessions
  secret:process.env.SECRET_KEY  // Secret key for session encryption
}));

// Passport middleware for authentication
app.use(passport.initialize()); // Initializes Passport
app.use(passport.session()); // Manages persistent login sessions

// Configuring Passport's serialize and deserialize methods
passport.serializeUser(function(user, done) {
  done(null, user); // Serializes user data
});

passport.deserializeUser(function(user, done) {
  done(null, user); // Deserializes user data
});

// Middleware for handling requests
app.use(cors({ 
  origin:process.env.FRONTEND_URL, // Replace with your frontend URL
  credentials: true,
   })); // Enables CORS for all routes
app.use(logger('dev')); // Logs HTTP requests
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads
app.use(cookieParser()); // Parses cookies from the request
app.use(express.static(path.join(__dirname, 'public'))); // Serves static files

// Mounting routes
app.use('/mentors', mentorRoutes);
app.use('/retrive', getTokenFromCookie);
app.use('/mentors', slotRoutes);
app.use('/sessions', sessionRoutes);
app.use('/api', authRoutes);
app.use('/auth', google);
app.use('/mentee', menteeRoutes);
app.use('/profile', profileRoutes);
app.use('/community', communityRoutes);
app.use('/communityPost', communityPostRoutes);
app.use('/video', videoSession);
app.use('/generalPost', general);

// Handling 404 errors
app.use(function(req, res, next) {
  next(createError(404)); // Forward to error handler
});

// Error handling middleware
app.use(function(err, req, res, next) {
  // Setting locals for error message and stack trace (only in development mode)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Respond with the error status or 500 if not set
  res.status(err.status || 500);
  res.render('error'); // Renders the error page
});

module.exports = app; // Exports the app for use in other files
