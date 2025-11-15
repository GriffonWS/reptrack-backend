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
import { verifyUserToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Create Exercise Details
router.post("/create", verifyUserToken, createExerciseDetails);

// ✅ Update Exercise Details
router.put("/update/:id", verifyUserToken, updateExerciseDetails);

// ✅ Delete Exercise Details
router.delete("/delete/:id", verifyUserToken, deleteExerciseDetails);

// ✅ Get Exercise Details by ID
router.get("/get/:id", verifyUserToken, getExerciseDetails);

// ✅ Get All Exercise Details by User ID
router.get("/user-exercise", verifyUserToken, getAllExerciseDetailsByUserId);

// ✅ Get Exercise Details by User ID and Exercise Type
router.get("/user", verifyUserToken, getExerciseDetailsByUserIdAndExerciseType);

// ✅ Get Exercise Details from Last Day by Exercise Type
router.get("/last-day", verifyUserToken, getExerciseDetailsByLastDay);

// ✅ Get Exercise Details by Equipment
router.get(
  "/exercise-equipment",
  verifyUserToken,
  getLastExerciseDetailsByEquipment
);

// ✅ Get Exercise Details by Free Weight Exercise
router.get(
  "/free-weight",
  verifyUserToken,
  getLastExerciseDetailsByFreeWeightExercise
);

// ✅ Get Exercise Details by Other Exercise
router.get(
  "/other-exercise",
  verifyUserToken,
  getLastExerciseDetailsByOtherExercise
);

export default router;
