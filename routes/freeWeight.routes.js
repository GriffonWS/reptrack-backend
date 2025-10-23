import express from "express";
import {
  createFreeWeight,
  updateFreeWeight,
  getAllFreeWeights,
  getFreeWeightById,
  deleteFreeWeight,
  getUniqueCategoriesByGymOwnerId,
  getExerciseDetailsByCategoryAndGymOwnerId,
  getCombinedData,
} from "../controllers/freeWeight.controller.js";

const router = express.Router();

router.post("/create", createFreeWeight);
router.put("/update/:id", updateFreeWeight);
router.get("/all", getAllFreeWeights);
router.get("/get/:id", getFreeWeightById);
router.delete("/delete/:id", deleteFreeWeight);
router.get("/unique-categories", getUniqueCategoriesByGymOwnerId);
router.get("/exercise-details", getExerciseDetailsByCategoryAndGymOwnerId);
router.get("/combined-data", getCombinedData);

export default router;
