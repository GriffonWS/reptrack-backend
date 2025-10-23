import express from "express";
import { upload } from "../config/multer.js";
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

// Routes with memory storage multer (for S3 upload)
// ✅ Changed from "equipmentImage" to "equipment_image" to match form-data field name
router.post(
  "/create",
  verifyToken,
  upload.single("equipment_image"),
  createEquipment
);
router.put(
  "/update/:id",
  verifyToken,
  upload.single("equipment_image"),
  updateEquipment
);
router.delete("/delete/:id", verifyToken, deleteEquipment);
router.get("/get/:id", verifyToken, getEquipment);
router.get("/all", verifyToken, getAllEquipment);
router.get("/category", verifyToken, getEquipmentByCategory);
router.get("/equipmentNumber/:equipment_number", getEquipmentByNumber);

export default router;
