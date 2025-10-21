import express from "express";
import {
  createExerciseDetails,
  updateExerciseDetails,
  deleteExerciseDetails,
  getExerciseDetails,
  getAllExerciseDetailsByUserId,
  getExerciseDetailsByUserIdAndExerciseType,
  getExerciseDetailsByLastDay,
  getLastExerciseDetailsByEquipment,
  getLastExerciseDetailsByFreeWeightExercise,
  getLastExerciseDetailsByOtherExercise,
} from "../controllers/exerciseDetails.controller.js";

const router = express.Router();

// ✅ Create Exercise Details
router.post("/create", createExerciseDetails);

// ✅ Update Exercise Details
router.put("/update/:id", updateExerciseDetails);

// ✅ Delete Exercise Details
router.delete("/delete/:id", deleteExerciseDetails);

// ✅ Get Exercise Details by ID
router.get("/get/:id", getExerciseDetails);

// ✅ Get All Exercise Details by User ID
router.get("/user-exercise", getAllExerciseDetailsByUserId);

// ✅ Get Exercise Details by User ID and Exercise Type
router.get("/user", getExerciseDetailsByUserIdAndExerciseType);

// ✅ Get Exercise Details from Last Day by Exercise Type
router.get("/last-day", getExerciseDetailsByLastDay);

// ✅ Get Exercise Details by Equipment
router.get("/exercise-equipment", getLastExerciseDetailsByEquipment);

// ✅ Get Exercise Details by Free Weight Exercise
router.get("/free-weight", getLastExerciseDetailsByFreeWeightExercise);

// ✅ Get Exercise Details by Other Exercise
router.get("/other-exercise", getLastExerciseDetailsByOtherExercise);

export default router;
