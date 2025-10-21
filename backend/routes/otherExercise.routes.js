import express from "express";
import {
  createOtherExercise,
  getAllOtherExercisesByUser,
  getAllOtherExercises,
  getExercisesByCategory,
  updateOtherExercise,
  deleteOtherExercise,
} from "../controllers/otherExercise.controller.js";

const router = express.Router();

router.post("/create", createOtherExercise);
router.get("/user/all", getAllOtherExercisesByUser);
router.get("/all", getAllOtherExercises);
router.get("/category/user/all", getExercisesByCategory);
router.put("/update/:id", updateOtherExercise);
router.delete("/delete/:id", deleteOtherExercise);

export default router;
