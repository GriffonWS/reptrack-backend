import { FreeWeight } from "../models/freeWeightModel.js";
import { Op } from "sequelize";

export const freeWeightController = {
  // 🟢 Create new free weight record
  createFreeWeight: async (req, res) => {
    try {
      const { exercise_category, exercise_details, gym_owner_id } = req.body;

      if (!exercise_category || !exercise_details || !gym_owner_id) {
        return res.status(400).json({
          message:
            "All fields are required: exercise_category, exercise_details, gym_owner_id",
        });
      }

      const newWeight = await FreeWeight.create({
        exercise_category,
        exercise_details,
        gym_owner_id,
      });

      res.status(201).json({
        success: true,
        message: "Free weight record created successfully",
        data: newWeight,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create free weight record",
        error: error.message,
      });
    }
  },

  // 🟢 Update by ID
  updateFreeWeight: async (req, res) => {
    try {
      const { id } = req.params;
      const { exercise_category, exercise_details, gym_owner_id } = req.body;

      const record = await FreeWeight.findByPk(id);
      if (!record)
        return res
          .status(404)
          .json({ message: "Free weight record not found" });

      await record.update({
        exercise_category,
        exercise_details,
        gym_owner_id,
        timestamp: new Date(),
      });

      res.status(200).json({
        success: true,
        message: "Free weight record updated successfully",
        data: record,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update free weight record",
        error: error.message,
      });
    }
  },

  // 🟢 Get all
  getAllFreeWeights: async (req, res) => {
    try {
      const records = await FreeWeight.findAll({
        order: [["id", "DESC"]],
      });

      res.status(200).json({
        success: true,
        message: "All free weight records retrieved successfully",
        data: records,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch records",
        error: error.message,
      });
    }
  },

  // 🟢 Get by ID
  getFreeWeightById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await FreeWeight.findByPk(id);

      if (!record)
        return res
          .status(404)
          .json({ message: "Free weight record not found" });

      res.status(200).json({
        success: true,
        message: "Free weight record retrieved successfully",
        data: record,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch record",
        error: error.message,
      });
    }
  },

  // 🟢 Delete
  deleteFreeWeight: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await FreeWeight.findByPk(id);

      if (!record) return res.status(404).json({ message: "Record not found" });

      await record.destroy();

      res.status(200).json({
        success: true,
        message: "Free weight record deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete record",
        error: error.message,
      });
    }
  },

  // 🟢 Unique categories by gymOwnerId
  getUniqueCategoriesByGymOwnerId: async (req, res) => {
    try {
      const { gym_owner_id } = req.query;
      const categories = await FreeWeight.findAll({
        where: { gym_owner_id },
        attributes: ["exercise_category"], // ✅ Fixed
        group: ["exercise_category"], // ✅ Fixed
      });

      res.status(200).json({
        success: true,
        message: "Unique categories fetched successfully",
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
        error: error.message,
      });
    }
  },

  // 🟢 Get exercise details by category and gymOwnerId
  getExerciseDetailsByCategoryAndGymOwnerId: async (req, res) => {
    try {
      const { gym_owner_id, exercise_category } = req.query; // ✅ Fixed variable name

      const details = await FreeWeight.findAll({
        where: {
          gym_owner_id,
          exercise_category, // ✅ Fixed - using correct field name and variable
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
  },
};
