import express from "express";
import {
  createCustomFreeWeightExercise,
  getFreeWeightsByCategory,
  deleteCustomFreeWeightExercise,
  getUserCustomFreeWeightExercises,
} from "../controllers/userFreeWeightExercise.controller.js";
import { verifyUserToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyUserToken, createCustomFreeWeightExercise);
router.get("/category", verifyUserToken, getFreeWeightsByCategory);
router.delete("/delete/:id", verifyUserToken, deleteCustomFreeWeightExercise);
router.get("/user/all", verifyUserToken, getUserCustomFreeWeightExercises);

export default router;