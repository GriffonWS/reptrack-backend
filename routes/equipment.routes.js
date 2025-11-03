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
import {
  verifyGymOwnerToken,
  verifyUserToken,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected routes - Gym Owner
router.post(
  "/create",
  verifyGymOwnerToken,
  upload.single("equipment_image"),
  createEquipment
);
router.put(
  "/update/:id",
  verifyGymOwnerToken,
  upload.single("equipment_image"),
  updateEquipment
);
router.delete("/delete/:id", verifyGymOwnerToken, deleteEquipment);
router.get("/get/:id", verifyGymOwnerToken, getEquipment);
router.get("/all", verifyUserToken, getAllEquipment);
router.get("/category", verifyGymOwnerToken, getEquipmentByCategory);
router.get(
  "/equipmentNumber/:equipment_number",
  verifyGymOwnerToken,
  getEquipmentByNumber
);

export default router;
