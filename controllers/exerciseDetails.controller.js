import ExerciseDetails from "../models/exerciseDetails.model.js";
import Equipment from "../models/equipment.model.js";
import { Op } from "sequelize";

// ✅ Create Exercise Details
export const createExerciseDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      equipmentNumber,
      miles,
      speed,
      level,
      time,
      floor,
      reps,
      sets,
      weight,
      exerciseType,
      freeWeightExercise,
      other_exercise: otherExercise,
    } = req.body;

    if (!exerciseType) {
      return res.status(400).json({
        success: false,
        message: "exerciseType is required",
      });
    }

    let equipmentName = null;
    if (equipmentNumber) {
      // Scope to the user's own equipment + their gym owner's equipment,
      // since equipment_number is only unique within that scope (not globally).
      const gymOwnerId = req.user.gymOwnerId;
      const equipment = await Equipment.findOne({
        where: {
          equipment_number: equipmentNumber,
          [Op.or]: [
            { user_id: userId },
            ...(gymOwnerId ? [{ gym_owner_id: gymOwnerId }] : []),
          ],
        },
      });
      if (equipment) {
        equipmentName = equipment.equipment_name;
      }
    } else if (freeWeightExercise) {
      equipmentName = freeWeightExercise;
    } else if (otherExercise) {
      equipmentName = otherExercise;
    }

    const newDetail = await ExerciseDetails.create({
      user_id: userId,
      equipment_number: equipmentNumber,
      equipment_name: equipmentName,
      miles,
      speed,
      level,
      time,
      floor,
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
    const userId = req.user.id;
    const { id } = req.params;
    const { equipmentNumber, miles, speed, level, time, floor, reps, sets, weight, other_exercise: otherExercise } =
      req.body;

    const detail = await ExerciseDetails.findByPk(id);
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Exercise detail not found",
      });
    }

    // Verify the exercise belongs to the authenticated user
    if (detail.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You can only update your own exercise details.",
      });
    }

    await detail.update({
      equipment_number: equipmentNumber,
      miles,
      speed,
      level,
      time,
      floor,
      reps,
      sets,
      weight,
      other_exercise: otherExercise,
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
    const userId = req.user.id;
    const { id } = req.params;

    const detail = await ExerciseDetails.findByPk(id);
    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Exercise detail not found",
      });
    }

    // Verify the exercise belongs to the authenticated user
    if (detail.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You can only delete your own exercise details.",
      });
    }

    await detail.destroy();

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
    const userId = req.user.id;
    const { id } = req.params;

    const data = await ExerciseDetails.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Exercise detail not found",
      });
    }

    // Verify the exercise belongs to the authenticated user
    if (data.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own exercise details.",
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
    const userId = req.user.id;

    const details = await ExerciseDetails.findAll({
      where: { user_id: userId },
      order: [["id", "DESC"]],
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
    const userId = req.user.id;

    const { exerciseType } = req.query;

    if (!exerciseType) {
      return res.status(400).json({
        success: false,
        message: "exerciseType is required",
      });
    }

    const details = await ExerciseDetails.findAll({
      where: { user_id: userId, exercise_type: exerciseType },
      order: [["id", "DESC"]],
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
    const userId = req.user.id;

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
      order: [["id", "DESC"]],
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
    const userId = req.user.id;
    const { equipmentNumber } = req.query;

    console.log("🔍 Debug Info:");
    console.log("   User ID from token:", userId);
    console.log("   Equipment Number:", equipmentNumber);
    console.log("   User object:", req.user);

    if (!equipmentNumber) {
      return res.status(400).json({
        success: false,
        message: "equipmentNumber is required",
      });
    }

    const details = await ExerciseDetails.findAll({
      where: { user_id: userId, equipment_number: equipmentNumber },
      order: [["id", "DESC"]],
    });

    console.log("📊 Query Results:");
    console.log("   Records found:", details.length);
    console.log("   Data:", JSON.stringify(details, null, 2));

    res.status(200).json({
      success: true,
      message: "Exercise details fetched successfully",
      data: details,
    });
  } catch (error) {
    console.error("❌ Error:", error);
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
    const userId = req.user.id;

    const { freeWeightExercise } = req.query;

    if (!freeWeightExercise) {
      return res.status(400).json({
        success: false,
        message: "freeWeightExercise is required",
      });
    }

    const details = await ExerciseDetails.findAll({
      where: { user_id: userId, free_weight_exercise: freeWeightExercise },
      order: [["id", "DESC"]],
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
    const userId = req.user.id;

    const { otherExercise } = req.query;

    if (!otherExercise) {
      return res.status(400).json({
        success: false,
        message: "otherExercise is required",
      });
    }

    const details = await ExerciseDetails.findAll({
      where: { user_id: userId, other_exercise: otherExercise },
      order: [["id", "DESC"]],
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
