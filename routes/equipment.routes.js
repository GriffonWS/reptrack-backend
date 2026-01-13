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
  createUserEquipment,
  updateUserEquipment,
  deleteUserEquipment,
  getUserEquipmentById,
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

// Protected routes - User (View gym owner's equipment)
router.get("/user/all", verifyUserToken, getAllEquipmentForUser); // Get all equipment (gym owner + user's own)
router.get("/user/category", verifyUserToken, getEquipmentByCategoryForUser); // Get by category

// Protected routes - User (Manage their own equipment)
router.post(
  "/user/create",
  verifyUserToken,
  upload.single("equipment_image"),
  createUserEquipment
); // Create user's own equipment
router.get("/user/get/:id", verifyUserToken, getUserEquipmentById); // Get single user equipment
router.put(
  "/user/update/:id",
  verifyUserToken,
  upload.single("equipment_image"),
  updateUserEquipment
); // Update user's own equipment
router.delete("/user/delete/:id", verifyUserToken, deleteUserEquipment); // Delete user's own equipment

export default router;
