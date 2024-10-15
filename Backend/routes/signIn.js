var express = require('express');
var router = express.Router();
const UserModel = require('../Models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const key=process.env.JWT_SECRET;
router.post('/',async(req,res)=>{
    try {
        const{
            fullName,
            username,
            email,
            password
        }=req.body;

        const existinguser=await UserModel.findOne({Email:email})
        console.log(email);
        if(existinguser){
            console.log("existing")
            return res.status(200).json({
                success:false,
                message:"Already registerd"
            })
        }
        const hashPassword =await bcrypt.hash(password,10);
        const user=new UserModel({
            password:hashPassword,
            fullName,
            username,
            Email:email
        })
        await user.save();
        console.log("registered successfully");
        const token = await jwt.sign(
            {id: user._id },
            key,
            { expiresIn: '1h' }
          );
        
        res.cookie('token',token,{httpOnly:true,maxAge:3600000})
        return res.status(200).json({
          sucess:true,
          message:"user is registered succesfully",
          data:user,
          path:"/",
        })


    } catch (error) {
        return res.status(404).json({
            message:"Something went wrong",
            success:false
        })
    }

})

module.exports =router;