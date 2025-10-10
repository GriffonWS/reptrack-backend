import s3 from "../config/aws.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Upload file to S3 and return the public URL
 * @param {Object} file - Multer file object (from req.file)
 * @returns {Promise<string>} - S3 URL of uploaded file
 */
export const uploadToS3 = async (file) => {
  try {
    console.log("📤 Starting S3 upload...");
    console.log("📁 File details:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `equipment/${timestamp}-${randomString}.${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // Make file publicly accessible
    };

    console.log("🚀 Uploading to S3 bucket:", process.env.AWS_S3_BUCKET_NAME);

    // Upload to S3
    const result = await s3.upload(params).promise();

    console.log("✅ S3 upload successful!");
    console.log("📍 File location:", result.Location);

    return result.Location; // Returns the public URL
  } catch (error) {
    console.error("❌ S3 upload failed:", error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

export default uploadToS3;
