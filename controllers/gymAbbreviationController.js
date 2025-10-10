import { GymAbbreviation } from "../models/gymAbbreviationModel.js";

export const gymAbbreviationController = {
  // 🟢 Create new gym abbreviation
  createGymAbbreviation: async (req, res) => {
    try {
      const { abbreviation } = req.body;

      if (!abbreviation) {
        return res.status(400).json({
          success: false,
          message: "Abbreviation is required",
        });
      }

      const newAbbreviation = await GymAbbreviation.create({
        abbreviation,
      });

      res.status(201).json({
        success: true,
        message: "Gym abbreviation created successfully",
        data: newAbbreviation,
      });
    } catch (error) {
      // Handle unique constraint violation
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          success: false,
          message: "Abbreviation already exists",
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create gym abbreviation",
        error: error.message,
      });
    }
  },

  // 🟢 Update gym abbreviation by ID
  updateGymAbbreviation: async (req, res) => {
    try {
      const { id } = req.params;
      const { abbreviation } = req.body;

      if (!abbreviation) {
        return res.status(400).json({
          success: false,
          message: "Abbreviation is required",
        });
      }

      const record = await GymAbbreviation.findByPk(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Gym abbreviation not found",
        });
      }

      await record.update({
        abbreviation,
        timestamp: new Date(),
      });

      res.status(200).json({
        success: true,
        message: "Gym abbreviation updated successfully",
        data: record,
      });
    } catch (error) {
      // Handle unique constraint violation
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          success: false,
          message: "Abbreviation already exists",
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update gym abbreviation",
        error: error.message,
      });
    }
  },

  // 🟢 Get gym abbreviation by ID
  getGymAbbreviationById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await GymAbbreviation.findByPk(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Gym abbreviation not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Gym abbreviation retrieved successfully",
        data: record,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch gym abbreviation",
        error: error.message,
      });
    }
  },

  // 🟢 Get all gym abbreviations
  getAllGymAbbreviations: async (req, res) => {
    try {
      const records = await GymAbbreviation.findAll({
        order: [["id", "DESC"]],
      });

      res.status(200).json({
        success: true,
        message: "All gym abbreviations retrieved successfully",
        data: records,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch gym abbreviations",
        error: error.message,
      });
    }
  },

  // 🟢 Delete gym abbreviation by ID
  deleteGymAbbreviation: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await GymAbbreviation.findByPk(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Gym abbreviation not found",
        });
      }

      await record.destroy();

      res.status(200).json({
        success: true,
        message: "Gym abbreviation deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete gym abbreviation",
        error: error.message,
      });
    }
  },
};
