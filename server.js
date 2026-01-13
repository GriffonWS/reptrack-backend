import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import communicationSupportRoutes from "./routes/communicationSupport.routes.js";
import equipmentRoutes from "./routes/equipment.routes.js";
import gymAbbreviationRoutes from "./routes/gymAbbreviation.routes.js";
import exerciseDetailsRoutes from "./routes/exerciseDetails.routes.js";
import privacyPolicyRoutes from "./routes/privacyPolicy.routes.js";
import freeWeightRoutes from "./routes/freeWeight.routes.js";
import OtherExercise from "./routes/otherExercise.routes.js";
import gymOwner from "./routes/gymOwner.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", adminRoutes);
app.use("/users", userRoutes);
app.use("/communicationsupports", communicationSupportRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/gymabbreviations", gymAbbreviationRoutes);
app.use("/exercise-details", exerciseDetailsRoutes);
app.use("/privacypolicy", privacyPolicyRoutes);
app.use("/free-weight", freeWeightRoutes);
app.use("/other-exercise", OtherExercise);
app.use("/gym-owner", gymOwner);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Gym Tracking API 3 is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    data: null,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
  });
});

const PORT = process.env.PORT || 3000;

// Sync database and start server
const startServer = async () => {
  try {
    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log("✅ Database synchronized successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server  is running on port ${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
