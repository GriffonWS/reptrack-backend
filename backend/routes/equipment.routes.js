import express from "express";
import multer from "multer";
import {
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipment,
  getAllEquipment,
  getEquipmentByCategory,
  getEquipmentByNumber,
} from "../controllers/equipment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/create", verifyToken, upload.single("equipmentImage"), createEquipment);
router.put("/update/:id", verifyToken, upload.single("equipmentImage"), updateEquipment);
router.delete("/delete/:id", verifyToken, deleteEquipment);
router.get("/get/:id", verifyToken, getEquipment);
router.get("/all", verifyToken, getAllEquipment);
router.get("/category", verifyToken, getEquipmentByCategory);
router.get("/equipmentNumber/:equipmentNumber", getEquipmentByNumber);

export default router;
