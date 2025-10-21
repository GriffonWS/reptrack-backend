import OtherExercise from "../models/otherExercise.model.js";
import User from "../models/user.model.js"; // assuming you already have a User model
import { extractUserIdFromToken } from "../utils/tokenUtils.js"; // helper function for token auth

// 🧩 Create Other Exercise
export const createOtherExercise = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const userId = await extractUserIdFromToken(token);
    const { exercise_type, exercise_name, exercise_category } = req.body;

    const newExercise = await OtherExercise.create({
      exercise_type,
      exercise_name,
      exercise_category,
      user_id: userId,
    });

    res.status(201).json({
      success: true,
      message: "Other Exercise created successfully",
      data: newExercise,
    });
  } catch (error) {
    console.error("❌ Error creating exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create exercise",
      error: error.message,
    });
  }
};

// 🧩 Get All Other Exercises (by token user)
export const getAllOtherExercisesByUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const userId = await extractUserIdFromToken(token);
    const exercises = await OtherExercise.findAll({
      where: { user_id: userId },
    });

    res.status(200).json({
      success: true,
      message: "Exercises fetched successfully",
      data: exercises,
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

// 🧩 Get All Exercises (Admin)
export const getAllOtherExercises = async (req, res) => {
  try {
    const exercises = await OtherExercise.findAll();
    res.status(200).json({
      success: true,
      message: "All exercises fetched successfully",
      data: exercises,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises",
      error: error.message,
    });
  }
};

// 🧩 Get Exercises by Category (for user)
export const getExercisesByCategory = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const userId = await extractUserIdFromToken(token);
    const { exerciseCategory } = req.query;

    const exercises = await OtherExercise.findAll({
      where: { user_id: userId, exercise_category: exerciseCategory },
    });

    res.status(200).json({
      success: true,
      message: "Exercises by category fetched successfully",
      data: exercises,
    });
  } catch (error) {
    console.error("❌ Error fetching exercises:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises by category",
      error: error.message,
    });
  }
};

// 🧩 Update Other Exercise
export const updateOtherExercise = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const userId = await extractUserIdFromToken(token);
    const { id } = req.params;
    const { exercise_type, exercise_name, exercise_category } = req.body;

    const exercise = await OtherExercise.findOne({
      where: { id, user_id: userId },
    });
    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, message: "Exercise not found" });
    }

    await exercise.update({ exercise_type, exercise_name, exercise_category });

    res.status(200).json({
      success: true,
      message: "Exercise updated successfully",
      data: exercise,
    });
  } catch (error) {
    console.error("❌ Error updating exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update exercise",
      error: error.message,
    });
  }
};

// 🧩 Delete Other Exercise
export const deleteOtherExercise = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const userId = await extractUserIdFromToken(token);
    const { id } = req.params;

    const exercise = await OtherExercise.findOne({
      where: { id, user_id: userId },
    });
    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, message: "Exercise not found" });
    }

    await exercise.destroy();

    res.status(200).json({
      success: true,
      message: "Exercise deleted successfully",
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
