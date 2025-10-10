import express from "express";
import { gymAbbreviationController } from "../controllers/gymAbbreviationController.js";

const router = express.Router();

// 🟢 Create new gym abbreviation
router.post("/create", gymAbbreviationController.createGymAbbreviation);

// 🟢 Get all gym abbreviations
router.get("/get-all", gymAbbreviationController.getAllGymAbbreviations);

// 🟢 Update gym abbreviation by ID
router.put("/update/:id", gymAbbreviationController.updateGymAbbreviation);

// 🟢 Get gym abbreviation by ID
router.get("/get/:id", gymAbbreviationController.getGymAbbreviationById);

// 🟢 Delete gym abbreviation by ID
router.delete("/delete/:id", gymAbbreviationController.deleteGymAbbreviation);

export default router;
