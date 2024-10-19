const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // lowercase: true,
    // trim: true,
    // validate: {
    //   validator: function (v) {
    //     return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid email!`
    // }
  },
  otp: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // expires after 5 minutes (300 seconds)
  }
});

// a function to send emails
async function sendVerifiationEmail(email,otp){
    try{
       const mailResponse=await mailSender(email,"verification email from MentoConnect ",otp);
       console.log("email send successfully ",mailResponse);

    }catch(err){
        console.log("error occured while sending mails: ",err);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerifiationEmail(this.email,this.otp);
    next();
})

// Export the model
module.exports = mongoose.model('OTP', OTPSchema);
