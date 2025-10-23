import FreeWeight from "../models/freeWeight.model.js";
import GymAbbreviation from "../models/gymAbbreviation.model.js"; // if you have it
import { Op } from "sequelize";

// ✅ Create Free Weight
export const createFreeWeight = async (req, res) => {
  try {
    const { exerciseCategory, exerciseDetails, gymOwnerId } = req.body;

    if (!exerciseCategory || !exerciseDetails || !gymOwnerId) {
      return res.status(400).json({
        success: false,
        message:
          "exerciseCategory, exerciseDetails, and gymOwnerId are required",
      });
    }

    const newFreeWeight = await FreeWeight.create({
      exercise_category: exerciseCategory,
      exercise_details: exerciseDetails,
      gym_owner_id: gymOwnerId,
    });

    res.status(201).json({
      success: true,
      message: "Free Weight created successfully",
      data: newFreeWeight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Free Weight",
      error: error.message,
    });
  }
};

// ✅ Update Free Weight
export const updateFreeWeight = async (req, res) => {
  try {
    console.log("🟩 Request body:", req.body); // 👈 ADD HERE
    console.log("🟨 Request params:", req.params); // optional, useful for debugging id

    const { id } = req.params;
    const { exerciseCategory, exerciseDetails, gymOwnerId } = req.body;

    const freeWeight = await FreeWeight.findByPk(id);
    if (!freeWeight) {
      return res.status(404).json({
        success: false,
        message: "Free Weight not found",
      });
    }

    await freeWeight.update({
      exercise_category: exerciseCategory,
      exercise_details: exerciseDetails,
      gym_owner_id: gymOwnerId ?? freeWeight.gym_owner_id,
    });

    res.status(200).json({
      success: true,
      message: "Free Weight updated successfully",
      data: freeWeight,
    });
  } catch (error) {
    console.error("❌ Error updating Free Weight:", error); // 👈 add error log too
    res.status(500).json({
      success: false,
      message: "Failed to update Free Weight",
      error: error.message,
    });
  }
};

// ✅ Get All Free Weights
export const getAllFreeWeights = async (req, res) => {
  try {
    const weights = await FreeWeight.findAll({
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Free Weights fetched successfully",
      data: weights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Free Weights",
      error: error.message,
    });
  }
};

// ✅ Get Free Weight by ID
export const getFreeWeightById = async (req, res) => {
  try {
    const { id } = req.params;
    const weight = await FreeWeight.findByPk(id);

    if (!weight) {
      return res.status(404).json({
        success: false,
        message: "Free Weight not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Free Weight fetched successfully",
      data: weight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Free Weight",
      error: error.message,
    });
  }
};

// ✅ Delete Free Weight
export const deleteFreeWeight = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FreeWeight.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Free Weight not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Free Weight deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Free Weight",
      error: error.message,
    });
  }
};

// ✅ Get Unique Categories by Gym Owner ID
export const getUniqueCategoriesByGymOwnerId = async (req, res) => {
  try {
    const { gymOwnerId } = req.query;
    if (!gymOwnerId) {
      return res.status(400).json({
        success: false,
        message: "gymOwnerId is required",
      });
    }

    const categories = await FreeWeight.findAll({
      where: { gym_owner_id: gymOwnerId },
      attributes: ["exercise_category"],
      group: ["exercise_category"],
    });

    res.status(200).json({
      success: true,
      message: "Unique categories fetched successfully",
      data: categories.map((c) => c.exercise_category),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// ✅ Get Exercise Details by Category and Gym Owner ID
export const getExerciseDetailsByCategoryAndGymOwnerId = async (req, res) => {
  try {
    const { gymOwnerId, category } = req.query;

    if (!gymOwnerId || !category) {
      return res.status(400).json({
        success: false,
        message: "gymOwnerId and category are required",
      });
    }

    const details = await FreeWeight.findAll({
      where: {
        gym_owner_id: gymOwnerId,
        exercise_category: category,
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

// ✅ Combined Data (Categories + Abbreviations)
export const getCombinedData = async (req, res) => {
  try {
    const { gymOwnerId } = req.query;
    if (!gymOwnerId) {
      return res.status(400).json({
        success: false,
        message: "gymOwnerId is required",
      });
    }

    const categories = await FreeWeight.findAll({
      where: { gym_owner_id: gymOwnerId },
      attributes: ["exercise_category"],
      group: ["exercise_category"],
    });

    const abbreviations = await GymAbbreviation.findAll();

    res.status(200).json({
      success: true,
      message: "Category and abbreviation retrieved successfully",
      data: {
        categories: categories.map((c) => c.exercise_category),
        abbreviations,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch combined data",
      error: error.message,
    });
  }
};
