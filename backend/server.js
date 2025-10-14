// server.js - FIXED VERSION
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/mysql.js";

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
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📘 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`✅ Database connected successfully`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
