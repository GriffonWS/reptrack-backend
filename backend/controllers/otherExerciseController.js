import { OtherExercise } from "../models/otherExerciseModel.js";

export const otherExerciseController = {
  // 🟢 Create new other exercise (without token)
  createOtherExercise: async (req, res) => {
    try {
      const { exercise_type, exercise_name, exercise_category, user_id } =
        req.body;

      // Validate required field
      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "user_id is required",
        });
      }

      const newExercise = await OtherExercise.create({
        exercise_type,
        user_id,
        exercise_name,
        exercise_category,
      });

      res.status(201).json({
        success: true,
        message: "Other exercise created successfully",
        data: newExercise,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create other exercise",
        error: error.message,
      });
    }
  },

  // 🟢 Get all exercises by user_id
  getAllOtherExercisesByUser: async (req, res) => {
    try {
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "user_id query parameter is required",
        });
      }

      const exercises = await OtherExercise.findAll({
        where: { user_id },
        order: [["id", "DESC"]],
      });

      if (exercises.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No exercises found for this user",
        });
      }

      res.status(200).json({
        success: true,
        message: "User exercises retrieved successfully",
        data: exercises,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch user exercises",
        error: error.message,
      });
    }
  },

  // 🟢 Get exercises by category and user_id
  getExercisesByCategory: async (req, res) => {
    try {
      const { user_id, exerciseCategory } = req.query;

      if (!user_id || !exerciseCategory) {
        return res.status(400).json({
          success: false,
          message: "user_id and exerciseCategory query parameters are required",
        });
      }

      const exercises = await OtherExercise.findAll({
        where: {
          user_id,
          exercise_category: exerciseCategory,
        },
        order: [["id", "DESC"]],
      });

      if (exercises.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No exercises found for this category",
        });
      }

      res.status(200).json({
        success: true,
        message: "Exercises by category retrieved successfully",
        data: exercises,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch exercises by category",
        error: error.message,
      });
    }
  },

  // 🟢 Get all exercises (admin endpoint)
  getAllOtherExercises: async (req, res) => {
    try {
      const exercises = await OtherExercise.findAll({
        order: [["id", "DESC"]],
      });

      if (exercises.length === 0) {
        return res.status(204).json({
          success: true,
          message: "No exercises found",
          data: [],
        });
      }

      res.status(200).json({
        success: true,
        message: "All exercises retrieved successfully",
        data: exercises,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch all exercises",
        error: error.message,
      });
    }
  },

  // 🟢 Update exercise by ID
  updateOtherExercise: async (req, res) => {
    try {
      const { id } = req.params;
      const { exercise_type, exercise_name, exercise_category, user_id } =
        req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "user_id is required",
        });
      }

      // Find exercise and verify ownership
      const exercise = await OtherExercise.findOne({
        where: {
          id,
          user_id,
        },
      });

      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: "Exercise not found or doesn't belong to this user",
        });
      }

      // Update exercise
      await exercise.update({
        exercise_type,
        exercise_name,
        exercise_category,
        timestamp: new Date(),
      });

      res.status(200).json({
        success: true,
        message: "Exercise updated successfully",
        data: exercise,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update exercise",
        error: error.message,
      });
    }
  },

  // 🟢 Delete exercise by ID
  deleteOtherExercise: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "user_id is required",
        });
      }

      // Find exercise and verify ownership
      const exercise = await OtherExercise.findOne({
        where: {
          id,
          user_id,
        },
      });

      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: "Exercise not found or doesn't belong to this user",
        });
      }

      // Delete exercise
      await exercise.destroy();

      res.status(200).json({
        success: true,
        message: "Exercise deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete exercise",
        error: error.message,
      });
    }
  },
};
