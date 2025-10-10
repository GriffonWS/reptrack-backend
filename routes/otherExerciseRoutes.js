import express from "express";
import { otherExerciseController } from "../controllers/otherExerciseController.js";

const router = express.Router();

// 🟢 Get all exercises (admin endpoint - specific route first)
router.get("/get-all", otherExerciseController.getAllOtherExercises);

// 🟢 Get all exercises for authenticated user
router.get("/user/all", otherExerciseController.getAllOtherExercisesByUser);

// 🟢 Get exercises by category for authenticated user
router.get(
  "/category/user/all",
  otherExerciseController.getExercisesByCategory
);

// 🟢 Create new exercise (with JWT authentication)
router.post("/create", otherExerciseController.createOtherExercise);

// 🟢 Update exercise by ID (with JWT authentication)
router.put("/update/:id", otherExerciseController.updateOtherExercise);

// 🟢 Delete exercise by ID (with JWT authentication)
router.delete("/delete/:id", otherExerciseController.deleteOtherExercise);

export default router;
