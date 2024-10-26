let express = require('express');
let router = express.Router();
let passport = require('passport')
const dotenv=require('dotenv').config()
const jwt = require('jsonwebtoken')
const mentee = require('../Models/Mentee')

let GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const { json } = require('body-parser');
const CLIENT_ID=process.env.CLIENT_ID;
const CLIENT_SECRET=process.env.CLIENT_SECRET;
const CALLBACK=process.env.CALLBACK_URL;


console.log(CLIENT_ID,CLIENT_SECRET,CALLBACK)


passport.use(new GoogleStrategy({
    clientID:CLIENT_ID,
    clientSecret:CLIENT_SECRET,
    callbackURL:CALLBACK,
    scope:['profile','email'],
    passReqToCallback   : true
  },
 async function(request, accessToken, refreshToken, profile, done) {
     console.log(profile);
    let data = await mentee.findOne({email:profile.email});
    let user
    if(!data){
        user=new mentee({
            firstName:profile.displayName,
            email:profile.email
        })
        await user.save();
        // res.send(profile);
        console.log("google saved")
        return done(null,user);
    }
    else {
        console.log("already registeered user");
        // res.send(data)
        return done(null,data);
    }
  }
));

router.get('/googleAuth',
passport.authenticate('google', { scope:
    [ 'email', 'profile' ] })
);

router.get('/google',(req,res)=>{
    
    // console.log("reached",req.user);
    try {
        const token= jwt.sign({
            email:req.user.email,
            id:req.user._id
        },process.env.JWT_SECRET,{expiresIn:'1h'});
        const modifyToken = token.replace(/\./g, '-');
        res.cookie('token',token,{httpOnly:true,maxAge:3600000})
        res.redirect(`http://localhost:5173/google-callback/${modifyToken}`);
    } catch (error) {
        console.log(error);
        res.redirect('http://localhost:5173/signUpMentee');
    }
    // return res.status(200).json({
    //     success:true,
    //     message:"signed in successfully",
    //     token,
    //     path:"my-profile"
    // })
})

router.get('/googleAuth/callback',
passport.authenticate( 'google',{
    successRedirect: '/auth/google',
    failureRedirect: 'http://localhost:5173/signUpMentee'
})
);

module.exports = router;