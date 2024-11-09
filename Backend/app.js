let createError = require('http-errors');
let express = require('express');
let cors = require('cors');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let app = express();
let passport = require('passport');
let expressSession = require('express-session');
let indexRouter = require('./routes/index');
let authRoutes = require('./routes/AuthRoutes');
let mentorRoutes = require('./routes/mentorRoutes');
let videoSession = require('./routes/videoSession');
let slotRoutes = require('./routes/slots');
let menteeRoutes = require('./routes/menteeRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const profileRoutes = require('./routes/profileRoutes');
const communityRoutes = require('./routes/communityRoutes');
let google = require('./config/GoogleAuthConfig')
let db = require('./config/db')
db();
const fileupload = require("express-fileupload");
app.use(fileupload({ useTempFiles: true }));
const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "aryankesharwani"
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/mentors', mentorRoutes);
app.use('/mentors', slotRoutes);
app.use('/sessions', sessionRoutes);
app.use('/api', authRoutes);
app.use('/auth', google);
app.use('/mentee', menteeRoutes);
app.use('/profile', profileRoutes);
app.use('/community', communityRoutes);
app.use('/video', videoSession);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app; // Just export the app
