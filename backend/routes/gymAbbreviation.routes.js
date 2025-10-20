import express from "express";
import {
  createGymAbbreviation,
  updateGymAbbreviation,
  getGymAbbreviationById,
  getAllGymAbbreviations,
  deleteGymAbbreviation,
} from "../controllers/gymAbbreviation.controller.js";

const router = express.Router();

// Same endpoints as Java controller
router.post("/create", createGymAbbreviation);
router.put("/update/:id", updateGymAbbreviation);
router.get("/get/:id", getGymAbbreviationById);
router.get("/all", getAllGymAbbreviations);
router.delete("/delete/:id", deleteGymAbbreviation);

export default router;
