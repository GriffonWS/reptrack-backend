import s3 from "../config/aws.js";
import dotenv from "dotenv";

dotenv.config();

export const uploadToS3 = async (file, folder = "uploads") => {
  if (!file) return null; // No file uploaded, just return null

  try {
    console.log("📤 Starting S3 upload...");
    console.log("📁 File details:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      folder: folder,
    });

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    console.log("🚀 Uploading to S3 bucket:", process.env.AWS_S3_BUCKET_NAME);
    const result = await s3.upload(params).promise();
    console.log("✅ S3 upload successful!", result.Location);

    return result.Location;
  } catch (error) {
    console.error("❌ S3 upload failed:", error.message);
    console.error("Error details:", error);
    return null; // Return null instead of throwing error
  }
};
