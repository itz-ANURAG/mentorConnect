const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Function to configure and connect to Cloudinary using environment variables.
exports.cloudinaryConnect = () => {
    try {
        // Configure Cloudinary with cloud name, API key, and API secret.
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
    } catch (err) {
        // Handle errors during configuration.
        console.log("error ->", err);
    }
};

// Function to upload an image to Cloudinary with optional folder, height, and quality settings.
exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    // Prepare upload options based on the parameters provided.
    const options = { folder };

    // Add height to options if provided.
    if (height) {
        options.height = height;
    }

    // Add quality to options if provided.
    if (quality) {
        options.quality = quality;
    }

    // Set the resource type to auto to support various file types.
    options.resource_type = "auto";

    // Perform the upload to Cloudinary and return the result.
    return await cloudinary.uploader.upload(file.tempFilePath, options);
};
