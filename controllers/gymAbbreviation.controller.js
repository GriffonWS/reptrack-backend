import GymAbbreviation from "../models/gymAbbreviation.model.js";

// ✅ Create
export const createGymAbbreviation = async (req, res) => {
  try {
    const { abbreviation } = req.body;

    if (!abbreviation) {
      return res.status(400).json({
        success: false,
        message: "abbreviation is required",
      });
    }

    const exists = await GymAbbreviation.findOne({ where: { abbreviation } });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "abbreviation already exists",
      });
    }

    const newAbbreviation = await GymAbbreviation.create({ abbreviation });
    res.status(201).json({
      success: true,
      message: "Gym abbreviation created successfully",
      data: newAbbreviation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create gym abbreviation",
      error: error.message,
    });
  }
};

// ✅ Update
export const updateGymAbbreviation = async (req, res) => {
  try {
    const { id } = req.params;
    const { abbreviation } = req.body;

    const gymAbbr = await GymAbbreviation.findByPk(id);
    if (!gymAbbr) {
      return res.status(404).json({
        success: false,
        message: "Gym abbreviation not found",
      });
    }

    gymAbbr.abbreviation = abbreviation || gymAbbr.abbreviation;
    await gymAbbr.save();

    res.status(200).json({
      success: true,
      message: "Gym abbreviation updated successfully",
      data: gymAbbr,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update gym abbreviation",
      error: error.message,
    });
  }
};

// ✅ Get by ID
export const getGymAbbreviationById = async (req, res) => {
  try {
    const { id } = req.params;
    const gymAbbr = await GymAbbreviation.findByPk(id);

    if (!gymAbbr) {
      return res.status(404).json({
        success: false,
        message: "Gym abbreviation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gym abbreviation fetched successfully",
      data: gymAbbr,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gym abbreviation by ID",
      error: error.message,
    });
  }
};

// ✅ Get all
export const getAllGymAbbreviations = async (req, res) => {
  try {
    const data = await GymAbbreviation.findAll();
    res.status(200).json({
      success: true,
      message: "All gym abbreviations fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all gym abbreviations",
      error: error.message,
    });
  }
};

// ✅ Delete
export const deleteGymAbbreviation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GymAbbreviation.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Gym abbreviation not found",
      });
    }

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
};
