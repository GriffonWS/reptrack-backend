import express from "express";
import { freeWeightController } from "../controllers/freeWeightController.js";

const router = express.Router();

router.post("/create", freeWeightController.createFreeWeight);
router.put("/update/:id", freeWeightController.updateFreeWeight);
router.get("/get-all", freeWeightController.getAllFreeWeights);
router.get("/get/:id", freeWeightController.getFreeWeightById);
router.delete("/delete/:id", freeWeightController.deleteFreeWeight);
router.get(
  "/unique-categories",
  freeWeightController.getUniqueCategoriesByGymOwnerId
);
// http://localhost:3000/api/free-weight/unique-categories?gymOwnerId=1
router.get(
  "/exercise-details",
  freeWeightController.getExerciseDetailsByCategoryAndGymOwnerId
);
// http://localhost:3000/api/free-weight/exercise-details?gymOwnerId=1&category=Chest

export default router;
