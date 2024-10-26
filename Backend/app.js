let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let app = express();
let passport = require('passport')
let expressSession = require('express-session')
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let authRoutes = require('./routes/AuthRoutes')
let mentorRoutes = require('./routes/mentors');
let google = require('./config/GoogleAuthConfig')
let db = require('./config/db')
let cors = require ('cors')

// const authRoutes = require('./routes/AuthRoutes');
db();
const fileupload=require("express-fileupload");
app.use(fileupload({ useTempFiles: true }));
const {cloudinaryConnect}=require("./config/cloudinary");
cloudinaryConnect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(expressSession({
  resave:false,
  saveUninitialized:false,
  secret: "aryankesharwani"
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user,done){
  done(null,user);
});

passport.deserializeUser(function(user,done){
  done(null,user);
});


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/search', mentorRoutes);
app.use('/api', authRoutes);
app.use('/auth', google);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
