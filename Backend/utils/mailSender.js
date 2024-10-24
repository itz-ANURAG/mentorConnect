const nodemailer=require("nodemailer");
require("dotenv").config();

const mailSender= async (email,tittle,body)=>{
    try{
         let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
         }) 

         let info=await transporter.sendMail({
            from: "MentoConnect",
             to: `${email}`,
             subject:`${tittle}`,
             html:`${body}`,
         })
         console.log("info-> ",info);
         return info;


    }catch(err){
       console.log("error in mail sender-> ", err.message);
    }
}

module.exports=mailSender;