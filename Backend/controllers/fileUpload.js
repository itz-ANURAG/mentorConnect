const cloudinary=require("cloudinary").v2;

// checking supported file type
function isFileTypeSupported(type,supportedType){
    return supportedType.include(type);

}

// file upload to cloudinary
async function uploadFileToCloudinary(file,folder){
    const options={folder};
    console.log("temp file path ",file.tempFilePath);
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

// image uploader function
exports.imageUpload=async (req,res)=>{
    try{
      
    //   if want to fetch anything from req body use req.body

    // file fetching from req body
    const file=req.files.imageFile;
    console.log("file-> ",file);


    const supportedType=["jpg","jpeg","png"];
    const fileType=file.name.split('.')[1].toLowerCase();
    console.log("file type: ",fileType);

    if(!isFileTypeSupported(fileType,supportedType)){
        return res.status(400).json(
          {
            success:false,
            message:"File type not supported",
          }  
        )
    }

    console.log("uploading to cloudinary");
    const response=await uploadFileToCloudinary(file,"mentorConnect");
    console.log(response);

    res.status(200).json({
        success:true,
        imageUrl:response.secure_url,
        message:"image uploaded successfully",

    })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"internal server error while uploading file to cloudinary"
        })
    }
};