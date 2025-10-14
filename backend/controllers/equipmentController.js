import { Equipment } from "../models/equipmentModels.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const equipmentController = {
  // 🟢 Get all equipments
  getAllEquipments: async (req, res) => {
    try {
      const equipments = await Equipment.findAll({
        order: [["id", "DESC"]],
      });
      res.status(200).json(equipments);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch equipments",
        error: error.message,
      });
    }
  },

  // 🟢 Get equipment by category
  getByCategory: async (req, res) => {
    try {
      const { category } = req.params;

      const equipments = await Equipment.findAll({ where: { category } });

      if (!equipments.length) {
        return res
          .status(404)
          .json({ message: "No equipments found for this category" });
      }

      res.status(200).json(equipments);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch equipments by category",
        error: error.message,
      });
    }
  },

  // 🟢 Get equipment by equipment number
  getByEquipmentNumber: async (req, res) => {
    try {
      const { equipment_number } = req.params;

      const equipment = await Equipment.findOne({
        where: { equipment_number },
      });

      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      res.status(200).json(equipment);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch equipment by number",
        error: error.message,
      });
    }
  },

  // 🟢 Create equipment

  createEquipment: async (req, res) => {
    try {
      // 🔍 DEBUG: Log everything
      console.log("📥 Request body:", req.body);
      console.log("📁 Request file:", req.file);

      const { equipment_name, category, equipment_number, gym_owner_id } =
        req.body;

      // Validate required fields
      if (!equipment_name || !category || !equipment_number || !gym_owner_id) {
        return res.status(400).json({
          success: false,
          message:
            "equipment_name, category, equipment_number, and gym_owner_id are required",
        });
      }

      let imageUrl = null;

      // Upload image to S3 if file exists
      if (req.file) {
        console.log("📤 File detected! Uploading to S3...");
        console.log("📄 File details:", {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        });

        try {
          imageUrl = await uploadToS3(req.file);
          console.log("✅ S3 Upload successful! URL:", imageUrl);
        } catch (uploadError) {
          console.error("❌ S3 Upload failed:", uploadError);
          return res.status(500).json({
            success: false,
            message: "Failed to upload image to S3",
            error: uploadError.message,
          });
        }
      } else {
        console.log("⚠️ No file detected in request!");
      }

      console.log("💾 Saving to database with imageUrl:", imageUrl);

      // Create equipment record in database
      const newEquipment = await Equipment.create({
        equipment_name,
        category,
        equipment_number,
        equipment_image: imageUrl, // S3 URL saved here
        gym_owner_id,
      });

      console.log("✅ Equipment saved to database:", newEquipment.toJSON());

      res.status(201).json({
        success: true,
        message: "Equipment created successfully",
        data: {
          id: newEquipment.id,
          equipment_name: newEquipment.equipment_name,
          category: newEquipment.category,
          equipment_number: newEquipment.equipment_number,
          equipment_image: newEquipment.equipment_image, // Returns S3 URL
          gym_owner_id: newEquipment.gym_owner_id,
          timestamp: newEquipment.timestamp,
        },
      });
    } catch (error) {
      console.error("❌ Error creating equipment:", error);
      console.error("❌ Error stack:", error.stack);

      // Handle unique constraint error
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          success: false,
          message: "Equipment number already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create equipment",
        error: error.message,
      });
    }
  },

  // 🟡 Update equipment by ID
  updateEquipmentById: async (req, res) => {
    try {
      const { id } = req.params;
      const { equipment_name, category, equipment_number, gym_owner_id } =
        req.body;

      const equipment = await Equipment.findByPk(id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      let imageUrl = equipment.equipment_image;

      // ✅ If new image provided, upload to S3
      if (req.file) {
        imageUrl = await uploadToS3(req.file);
      }

      await equipment.update({
        equipment_name: equipment_name || equipment.equipment_name,
        category: category || equipment.category,
        equipment_number: equipment_number || equipment.equipment_number,
        gym_owner_id: gym_owner_id || equipment.gym_owner_id,
        equipment_image: imageUrl,
      });

      res.status(200).json({
        message: "Equipment updated successfully",
        data: equipment,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update equipment",
        error: error.message,
      });
    }
  },

  // 🔴 Delete equipment by ID
  deleteEquipmentById: async (req, res) => {
    try {
      const { id } = req.params;

      const equipment = await Equipment.findByPk(id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      await equipment.destroy();

      res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete equipment",
        error: error.message,
      });
    }
  },
};
