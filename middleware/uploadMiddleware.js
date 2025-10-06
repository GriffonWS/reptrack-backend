import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) return next(); // No image uploaded → continue to controller

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "equipment",
    });

    // Attach Cloudinary URL to req for controller to use
    req.file.path = result.secure_url;

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    next();
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image to Cloudinary",
      data: null,
    });
  }
};

export default uploadToCloudinary;
