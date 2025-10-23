import ExerciseDetails from "../models/exerciseDetails.model.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";
// Helper to extract userId from Bearer token
const extractUserIdFromToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ success: false, message: "Authorization header missing" });
    return null;
  }

  const token = authHeader.substring(7);
  const user = await User.findOne({ where: { token } });
  if (!user) {
    res.status(401).json({ success: false, message: "User not authorized" });
    return null;
  }
  return user.id;
};

// ✅ Create Exercise Details
export const createExerciseDetails = async (req, res) => {
  try {
    const userId = await extractUserIdFromToken(req, res);
    if (!userId) return;

    const {
      equipmentNumber,
      miles,
      speed,
      reps,
      sets,
      weight,
      exerciseType,
      freeWeightExercise,
      otherExercise,
    } = req.body;

    if (!exerciseType) {
      return res.status(400).json({
        success: false,
        message: "exerciseType is required",
      });
    }

    const newDetail = await ExerciseDetails.create({
      user_id: userId,
      equipment_number: equipmentNumber,
      miles,
      speed,
      reps,
      sets,
      weight,
      exercise_type: exerciseType,
      free_weight_exercise: freeWeightExercise,
      other_exercise: otherExercise,
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
};

// ✅ Update Exercise Details
export const updateExerciseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { equipmentNumber, miles, speed, reps, sets, weight } = req.body;

    const detail = await ExerciseDetails.findByPk(id);
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Exercise detail not found",
      });
    }

    await detail.update({
      equipment_number: equipmentNumber,
      miles,
      speed,
      reps,
      sets,
      weight,
    });

    res.status(200).json({
      success: true,
      message: "Exercise details updated successfully",
      data: detail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update exercise details",
      error: error.message,
    });
  }
};

// ✅ Delete Exercise Details
export const deleteExerciseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ExerciseDetails.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Exercise detail not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exercise detail deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete exercise detail",
      error: error.message,
    });
  }
};

// ✅ Get Exercise Details by ID
export const getExerciseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ExerciseDetails.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Exercise detail not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exercise detail fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise detail",
      error: error.message,
    });
  }
};

// ✅ Get All Exercise Details by User ID
export const getAllExerciseDetailsByUserId = async (req, res) => {
  try {
    const userId = await extractUserIdFromToken(req, res);
    if (!userId) return;

    const details = await ExerciseDetails.findAll({
      where: { user_id: userId },
    });

    res.status(200).json({
      success: true,
      message: "Exercise details fetched successfully",
      data: details,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise details",
      error: error.message,
    });
  }
};

// ✅ Get Exercise Details by User ID and Exercise Type
export const getExerciseDetailsByUserIdAndExerciseType = async (req, res) => {
  try {
    const userId = await extractUserIdFromToken(req, res);
    if (!userId) return;

    const { exerciseType } = req.query;

    if (!exerciseType) {
      return res.status(400).json({
        success: false,
        message: "exerciseType is required",
      });
    }

    const details = await ExerciseDetails.findAll({
      where: { user_id: userId, exercise_type: exerciseType },
    });

    res.status(200).json({
      success: true,
      message: "Exercise details fetched successfully",
      data: details,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise details",
      error: error.message,
    });
  }
};

// ✅ Get Exercise Details from Last Day by Exercise Type
export const getExerciseDetailsByLastDay = async (req, res) => {
  try {
    const userId = await extractUserIdFromToken(req, res);
    if (!userId) return;

    const { exerciseType } = req.query;
    if (!exerciseType) {
      return res.status(400).json({
        success: false,
        message: "exerciseType is required",
      });
    }

    // 🕐 Calculate the last day's start (00:00:00)
    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 1);
    lastDay.setHours(0, 0, 0, 0);

    // 🧠 Filter by exercise_date, not createdAt
    const details = await ExerciseDetails.findAll({
      where: {
        user_id: userId,
        exercise_type: exerciseType,
        exercise_date: { [Op.gte]: lastDay },
      },
    });

    res.status(200).json({
      success: true,
      message: "Exercise details fetched successfully",
      data: details,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise details",
      error: error.message,
    });
  }
};

// ✅ Get Exercise Details by Equipment
export const getLastExerciseDetailsByEquipment = async (req, res) => {
  try {
    const userId = await extractUserIdFromToken(req, res);
    if (!userId) return;

    const { equipmentNumber } = req.query;

    if (!equipmentNumber) {
      return res.status(400).json({
        success: false,
        message: "equipmentNumber is required",
      });
    }

    const details = await ExerciseDetails.findAll({
      where: { user_id: userId, equipment_number: equipmentNumber },
      order: [["exercise_date", "DESC"]], // ✅ fixed
    });

    res.status(200).json({
      success: true,
      message: "Exercise details fetched successfully",
      data: details,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise details",
      error: error.message,
    });
  }
};

// ✅ Get Exercise Details by Free Weight Exercise
export const getLastExerciseDetailsByFreeWeightExercise = async (req, res) => {
  try {
    const userId = await extractUserIdFromToken(req, res);
    if (!userId) return;

    const { freeWeightExercise } = req.query;

    if (!freeWeightExercise) {
      return res.status(400).json({
        success: false,
        message: "freeWeightExercise is required",
      });
    }

    const details = await ExerciseDetails.findAll({
      where: { user_id: userId, free_weight_exercise: freeWeightExercise },
      order: [["exercise_date", "DESC"]], // ✅ fixed
    });

    res.status(200).json({
      success: true,
      message: "Exercise details fetched successfully",
      data: details,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise details",
      error: error.message,
    });
  }
};

// ✅ Get Exercise Details by Other Exercise
export const getLastExerciseDetailsByOtherExercise = async (req, res) => {
  try {
    const userId = await extractUserIdFromToken(req, res);
    if (!userId) return;

    const { otherExercise } = req.query;

    if (!otherExercise) {
      return res.status(400).json({
        success: false,
        message: "otherExercise is required",
      });
    }

    const details = await ExerciseDetails.findAll({
      where: { user_id: userId, other_exercise: otherExercise },
      order: [["exercise_date", "DESC"]], // ✅ fixed
    });

    res.status(200).json({
      success: true,
      message: "Exercise details fetched successfully",
      data: details,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise details",
      error: error.message,
    });
  }
};
