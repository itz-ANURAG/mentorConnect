const express=require("express");
const router=express.Router();

const{imageUpload}=require("../controllers/fileUpload");


router.post("/imageUpload",imageUpload);
module.exports=router;