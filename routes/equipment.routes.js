import express from "express";
import { upload } from "../config/multer.js";
import {
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipment,
  getEquipmentByCategory,
  getEquipmentByNumber,
  getAllEquipmentForGymOwner,
  getAllEquipmentForUser,
  getEquipmentByCategoryForUser,
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
router.get("/all", verifyGymOwnerToken, getAllEquipmentForGymOwner); // Gym Owner route
router.get("/category", verifyGymOwnerToken, getEquipmentByCategory);
router.get(
  "/equipmentNumber/:equipment_number",
  verifyGymOwnerToken,
  getEquipmentByNumber
);

// Protected routes - User
router.get("/user/all", verifyUserToken, getAllEquipmentForUser); // User route
router.get("/user/category", verifyUserToken, getEquipmentByCategoryForUser); // User route - Get by category

export default router;
