const cloudinary = require("cloudinary").v2;
require("dotenv").config();

async function CloudinaryImageUpload(image, folder) {
  cloudinary.config({
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    secure: true,
  });
  const response = await cloudinary.uploader.upload(image.tempFilePath, {
    folder,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    unique_filename: true,
  });
  return response.secure_url;
}

module.exports = CloudinaryImageUpload;
