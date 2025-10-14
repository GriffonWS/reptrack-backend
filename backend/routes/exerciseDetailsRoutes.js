import express from "express";
import { exerciseDetailsController } from "../controllers/exerciseDetailsController.js";

const router = express.Router();

router.post("/create", exerciseDetailsController.createExerciseDetails);
router.get("/get-all", exerciseDetailsController.getAllExerciseDetails);
router.get("/get/:id", exerciseDetailsController.getExerciseDetailsById);
router.put("/update/:id", exerciseDetailsController.updateExerciseDetails);
router.delete("/delete/:id", exerciseDetailsController.deleteExerciseDetails);

export default router;
