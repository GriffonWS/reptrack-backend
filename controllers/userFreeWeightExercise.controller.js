import UserFreeWeightExercise from "../models/userFreeWeightExercise.model.js";
import FreeWeight from "../models/freeWeight.model.js";

// ✅ Create Custom Free Weight Exercise
export const createCustomFreeWeightExercise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exercise_name, category } = req.body;

    if (!exercise_name || !category) {
      return res.status(400).json({
        success: false,
        message: "exercise_name and category are required",
      });
    }

    const newExercise = await UserFreeWeightExercise.create({
      user_id: userId,
      exercise_name,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Custom free weight exercise created successfully",
      data: newExercise,
    });
  } catch (error) {
    console.error("❌ Error creating custom exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create custom exercise",
      error: error.message,
    });
  }
};

// ✅ Get Free Weights by Category (Predefined + User's Custom)
export const getFreeWeightsByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "category is required",
      });
    }

    // Get predefined free weight exercises
    const predefinedExercises = await FreeWeight.findAll({
      where: { exercise_category: category },
      attributes: ["id", "exercise_details", "exercise_category"],
    });

    // Get user's custom free weight exercises for this category
    const customExercises = await UserFreeWeightExercise.findAll({
      where: { user_id: userId, category },
      attributes: ["id", "exercise_name", "category"],
    });

    // Combine both lists with normalized field names
    const allExercises = [
      ...predefinedExercises.map((ex) => ({
        id: ex.id,
        exercise_name: ex.exercise_details,
        category: ex.exercise_category,
        is_custom: false,
      })),
      ...customExercises.map((ex) => ({
        id: ex.id,
        exercise_name: ex.exercise_name,
        category: ex.category,
        is_custom: true,
      })),
    ];

    res.status(200).json({
      success: true,
      message: "Free weight exercises fetched successfully",
      data: allExercises,
      total: allExercises.length,
    });
  } catch (error) {
    console.error("❌ Error fetching exercises:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises",
      error: error.message,
    });
  }
};

// ✅ Delete Custom Free Weight Exercise (Only creator can delete)
export const deleteCustomFreeWeightExercise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const exercise = await UserFreeWeightExercise.findByPk(id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Custom exercise not found",
      });
    }

    // Verify the user is the creator
    if (exercise.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own custom exercises",
      });
    }

    await exercise.destroy();

    res.status(200).json({
      success: true,
      message: "Custom exercise deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete exercise",
      error: error.message,
    });
  }
};

// ✅ Get User's Custom Free Weight Exercises
export const getUserCustomFreeWeightExercises = async (req, res) => {
  try {
    const userId = req.user.id;

    const exercises = await UserFreeWeightExercise.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "User custom exercises fetched successfully",
      data: exercises,
    });
  } catch (error) {
    console.error("❌ Error fetching user exercises:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user exercises",
      error: error.message,
    });
  }
};