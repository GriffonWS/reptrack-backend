// server.js - WITH S3 CONNECTION CHECK
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/mysql.js";
import s3 from "./config/aws.js"; // Import S3 config

// Import routes
import adminRoutes from "./routes/adminRoutes.js";
import communicationSupportRoutes from "./routes/communicationSupportRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import privacyPolicyRoutes from "./routes/privacyPolicyRoutes.js";
import exerciseDetailsRoutes from "./routes/exerciseDetailsRoutes.js";
import freeWeightRoutes from "./routes/freeWeightRoutes.js";
import gymAbbreviationRoutes from "./routes/gymAbbreviationRoutes.js";
import otherExerciseRoutes from "./routes/otherExerciseRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // Load environment variables

const app = express();

// ✅ CORS - Keep this first
app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS || "http://localhost:5173",
    credentials: true,
  })
);

// 🚨 CRITICAL FIX: Routes BEFORE body parsers
// Equipment routes need to come BEFORE express.json() and express.urlencoded()
// because multer handles multipart/form-data differently
app.use("/api/equipment", equipmentRoutes);

// ✅ Body parsers AFTER multer routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Other routes (they can use JSON/urlencoded)
app.use("/api/admin", adminRoutes);
app.use("/api/support", communicationSupportRoutes);
app.use("/api/privacy-policy", privacyPolicyRoutes);
app.use("/api/exercise-details", exerciseDetailsRoutes);
app.use("/api/free-weights", freeWeightRoutes);
app.use("/api/gym-abbreviations", gymAbbreviationRoutes);
app.use("/api/other-exercises", otherExerciseRoutes);
app.use("/api/admin/users", userRoutes);

// 🔧 S3 Connection Check Function
const checkS3Connection = async () => {
  try {
    // List buckets to verify credentials and connection
    const data = await s3.listBuckets().promise();
    console.log("✅ S3 connected successfully");
    console.log(`📦 Available buckets: ${data.Buckets.length}`);

    // Optional: Check if specific bucket exists
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (bucketName) {
      try {
        await s3.headBucket({ Bucket: bucketName }).promise();
        console.log(`✅ Target bucket '${bucketName}' is accessible`);
      } catch (bucketError) {
        console.warn(`⚠️  Warning: Cannot access bucket '${bucketName}'`);
        console.warn(`   Error: ${bucketError.message}`);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ S3 connection failed:");
    console.error(`   Error: ${error.message}`);

    // More specific error messages
    if (error.code === "InvalidAccessKeyId") {
      console.error("   → Check your AWS_ACCESS_KEY_ID");
    } else if (error.code === "SignatureDoesNotMatch") {
      console.error("   → Check your AWS_SECRET_ACCESS_KEY");
    } else if (error.code === "InvalidToken") {
      console.error("   → Your AWS credentials may have expired");
    }

    return false;
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check S3 connection
    const s3Connected = await checkS3Connection();

    if (!s3Connected) {
      console.warn("⚠️  Server starting without S3 connection");
      console.warn("   File uploads may not work properly");
    }

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📘 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`✅ Database connected successfully`);
      if (s3Connected) {
        console.log(`✅ S3 connected successfully`);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
