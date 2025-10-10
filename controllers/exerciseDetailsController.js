import { ExerciseDetails } from "../models/exerciseDetailsModel.js";

export const exerciseDetailsController = {
  // 🟢 Create exercise details
  createExerciseDetails: async (req, res) => {
    try {
      const {
        user_id,
        equipment_number,
        miles,
        speed,
        reps,
        sets,
        weight,
        exercise_type,
        free_weight_exercise,
        other_exercise,
      } = req.body;

      if (!user_id || !exercise_type) {
        return res
          .status(400)
          .json({ message: "user_id and exercise_type are required" });
      }

      const newDetail = await ExerciseDetails.create({
        user_id,
        equipment_number,
        miles,
        speed,
        reps,
        sets,
        weight,
        exercise_type,
        free_weight_exercise,
        other_exercise,
      });

      res.status(201).json({
        success: true,
        message: "Exercise details created successfully",
        data: newDetail,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create exercise details",
        error: error.message,
      });
    }
  },

  // 🟢 Get all exercise details
  getAllExerciseDetails: async (req, res) => {
    try {
      const data = await ExerciseDetails.findAll({
        order: [["id", "DESC"]],
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 🟢 Get by ID
  getExerciseDetailsById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await ExerciseDetails.findByPk(id);

      if (!record)
        return res.status(404).json({ message: "Exercise record not found" });

      res.status(200).json({ success: true, data: record });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 🟢 Update
  updateExerciseDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await ExerciseDetails.update(req.body, {
        where: { id },
      });

      if (updated[0] === 0)
        return res.status(404).json({ message: "Exercise record not found" });

      res.status(200).json({
        success: true,
        message: "Exercise details updated successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 🟢 Delete
  deleteExerciseDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ExerciseDetails.destroy({ where: { id } });

      if (!deleted)
        return res.status(404).json({ message: "Exercise record not found" });

      res.status(200).json({
        success: true,
        message: "Exercise details deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
