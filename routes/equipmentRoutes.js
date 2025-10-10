import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { equipmentController } from "../controllers/equipmentController.js";

const router = express.Router();

// Create equipment with image upload
router.post(
  "/create",
  upload.single("equipment_image"),
  equipmentController.createEquipment
);

// Update equipment
router.put(
  "/update/:id",
  upload.single("equipment_image"),
  equipmentController.updateEquipmentById
);

// Delete equipment
router.delete("/delete/:id", equipmentController.deleteEquipmentById);

// Get all equipment
router.get("/get-all", equipmentController.getAllEquipments);

// Get by category
router.get("/category/:category", equipmentController.getByCategory);

// Get by equipment number
router.get(
  "/number/:equipment_number",
  equipmentController.getByEquipmentNumber
);

export default router;
