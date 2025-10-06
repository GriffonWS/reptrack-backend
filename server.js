import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import { swaggerDocs } from "./swagger.js";
import adminRoutes from "./routes/adminRoutes.js";
import communicationSupportRoutes from "./routes/communicationSupportRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";

dotenv.config(); // Loads .env file variables

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World from Node.js + Express + MongoDB!");
});

app.use("/api", adminRoutes);
app.use("/api/communicationsupports", communicationSupportRoutes);
app.use("/api/equipments", equipmentRoutes);

swaggerDocs(app);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("Swagger docs available at http://localhost:3000/api-docs");
});
