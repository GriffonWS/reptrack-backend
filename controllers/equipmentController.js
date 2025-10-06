import Equipment from "../models/equipmentModels.js";

/**
 * Equipment Controller
 * Handles CRUD operations for gym equipment
 */

const equipmentController = {
  // Create Equipment
  createEquipment: async (req, res) => {
    try {
      // Make sure body exists
      if (!req.body) {
        return res.status(400).json({
          success: false,
          message:
            "Request body is missing. Make sure you are sending form data.",
          data: null,
        });
      }

      const { equipmentName, category, equipmentNumber } = req.body;
      const equipmentImage = req.file ? req.file.filename : null;

      if (!equipmentName || !equipmentNumber) {
        return res.status(400).json({
          success: false,
          message: "equipmentName and equipmentNumber are required",
          data: null,
        });
      }

      // Check if equipmentNumber already exists
      const existingEquipment = await Equipment.findOne({ equipmentNumber });
      if (existingEquipment) {
        return res.status(400).json({
          success: false,
          message: "Equipment with this number already exists",
          data: null,
        });
      }

      const newEquipment = new Equipment({
        equipmentName,
        category,
        equipmentNumber,
        equipmentImage,
      });

      const saved = await newEquipment.save();

      return res.status(201).json({
        success: true,
        message: "Equipment created successfully",
        data: saved,
      });
    } catch (error) {
      console.error("Create Equipment Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  // Update Equipment
  updateEquipment: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (req.file) {
        updates.equipmentImage = req.file.filename;
      }

      const updated = await Equipment.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Equipment updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Update Equipment Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  // Delete Equipment
  deleteEquipment: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Equipment.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Equipment deleted successfully",
        data: null,
      });
    } catch (error) {
      console.error("Delete Equipment Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  // Get Equipment by ID
  getEquipmentById: async (req, res) => {
    try {
      const { id } = req.params;
      const equipment = await Equipment.findById(id);

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Equipment fetched successfully",
        data: equipment,
      });
    } catch (error) {
      console.error("Get Equipment Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  // Get All Equipment
  getAllEquipment: async (req, res) => {
    try {
      const equipments = await Equipment.find();
      return res.status(200).json({
        success: true,
        message: "All equipment fetched successfully",
        data: equipments,
      });
    } catch (error) {
      console.error("Get All Equipment Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  // Get Equipment by Category
  getEquipmentByCategory: async (req, res) => {
    try {
      const { category } = req.query;

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category query parameter is required",
          data: null,
        });
      }

      const equipments = await Equipment.find({ category });

      if (!equipments.length) {
        return res.status(404).json({
          success: false,
          message: "No equipment found for the given category",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Equipment fetched successfully by category",
        data: equipments,
      });
    } catch (error) {
      console.error("Get Equipment by Category Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  // Get Equipment by Number
  getEquipmentByNumber: async (req, res) => {
    try {
      const { equipmentNumber } = req.params;
      const equipment = await Equipment.findOne({ equipmentNumber });

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Equipment fetched successfully",
        data: equipment,
      });
    } catch (error) {
      console.error("Get Equipment by Number Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },
};

export default equipmentController;
