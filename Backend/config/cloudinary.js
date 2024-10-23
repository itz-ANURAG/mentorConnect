 const cloudinary =require("cloudinary").v2;
require("dotenv").config();
     
     exports.cloudinaryConnect=()=>{
        try{
            cloudinary.config({
                cloud_name:process.env.CLOUD_NAME,
                api_key:process.env.API_KEY,
                api_secret:process.env.API_SECRET,
            })     


        }catch(err){
             console.log("error ->", err);
        }
     }

     
exports.uploadImageToCloudinary=async (file,folder,height,quality)=>{
    const options={folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto";

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}