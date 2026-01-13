import Equipment from "../models/equipment.model.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { Op } from "sequelize";

export const createEquipment = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;
    const { equipment_name, category, equipment_number } = req.body;
    console.log(req.body);
    const file = req.file;

    if (!equipment_name || !equipment_number) {
      return res.status(400).json({
        success: false,
        message: "Equipment name and number are required",
      });
    }

    // Check if equipment number already exists for this gym owner
    const existingEquipment = await Equipment.findOne({
      where: {
        equipment_number,
        gym_owner_id: gymOwnerId,
      },
    });

    if (existingEquipment) {
      return res.status(400).json({
        success: false,
        message: `Equipment number "${equipment_number}" already exists. Please use a unique number.`,
      });
    }

    // Try to upload image to S3 (if file exists)
    let imageUrl = null;
    if (file) {
      try {
        imageUrl = await uploadToS3(file, "equipment");
        if (!imageUrl) {
          console.warn(
            "⚠️ S3 upload returned null, proceeding with null image"
          );
        }
      } catch (error) {
        console.error(
          "⚠️ S3 upload failed, proceeding with null image:",
          error.message
        );
      }
    }

    // Create equipment (even if S3 upload failed)
    const newEquipment = await Equipment.create({
      equipment_name,
      category,
      equipment_number,
      equipment_image: imageUrl,
      gym_owner_id: gymOwnerId,
    });

    res.status(201).json({
      success: true,
      message: "Equipment created successfully",
      data: newEquipment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create equipment",
      error: error.message,
    });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;
    const { id } = req.params;
    const { equipment_name, category, equipment_number } = req.body;
    const file = req.file;

    const equipment = await Equipment.findOne({
      where: { id, gym_owner_id: gymOwnerId },
    });

    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }

    // Check if equipment number is being changed to a number that already exists
    if (equipment_number !== equipment.equipment_number) {
      const existingEquipment = await Equipment.findOne({
        where: {
          equipment_number,
          gym_owner_id: gymOwnerId,
          id: { [Op.ne]: id }, // Exclude the current equipment
        },
      });

      if (existingEquipment) {
        return res.status(400).json({
          success: false,
          message: `Equipment number "${equipment_number}" already exists. Please use a unique number.`,
        });
      }
    }

    // Keep existing image if no new file uploaded
    let imageUrl = equipment.equipment_image;

    // Try to upload new image to S3 (if file exists)
    if (file) {
      try {
        const newImageUrl = await uploadToS3(file, "equipment");
        if (newImageUrl) {
          imageUrl = newImageUrl;
        } else {
          console.warn("⚠️ S3 upload returned null, keeping existing image");
        }
      } catch (error) {
        console.error(
          "⚠️ S3 upload failed, keeping existing image:",
          error.message
        );
      }
    }

    await equipment.update({
      equipment_name,
      category,
      equipment_number,
      equipment_image: imageUrl,
    });

    // Reload to get fresh data
    await equipment.reload();

    res.json({
      success: true,
      message: "Equipment updated successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update equipment",
      error: error.message,
    });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;
    const { id } = req.params;

    const equipment = await Equipment.findOne({
      where: { id, gym_owner_id: gymOwnerId },
    });

    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }

    await equipment.destroy();

    res.json({
      success: true,
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete equipment",
      error: error.message,
    });
  }
};

export const getEquipment = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;
    const { id } = req.params;

    const equipment = await Equipment.findOne({
      where: { id, gym_owner_id: gymOwnerId },
    });

    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipment",
      error: error.message,
    });
  }
};

// Add these two new functions to equipment.controller.js

// For Gym Owner - Get all their equipment
export const getAllEquipmentForGymOwner = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;

    const equipments = await Equipment.findAll({
      where: { gym_owner_id: gymOwnerId },
    });

    res.json({ success: true, data: equipments });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipments",
      error: error.message,
    });
  }
};

export const getAllEquipmentForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const gymOwnerId = req.user.gymOwnerId;

    if (!gymOwnerId) {
      return res.status(400).json({
        success: false,
        message: "User is not associated with any gym",
      });
    }

    // Fetch both gym owner's equipment and user's personal equipment
    const equipments = await Equipment.findAll({
      where: {
        [Op.or]: [
          { gym_owner_id: gymOwnerId }, // Gym owner's equipment
          { user_id: userId }, // User's personal equipment
        ],
      },
      order: [["timestamp", "DESC"]],
    });

    res.json({
      success: true,
      message: `Found ${equipments.length} equipment(s)`,
      data: equipments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipments",
      error: error.message,
    });
  }
};

export const getEquipmentByCategory = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;
    const { category } = req.query;

    console.log("🔍 Searching for category:", category);
    console.log("🔍 Gym Owner ID:", gymOwnerId);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required",
        data: null,
      });
    }

    // Case-insensitive search using LIKE
    const equipments = await Equipment.findAll({
      where: {
        category: {
          [Op.like]: category, // Case-insensitive match
        },
        gym_owner_id: gymOwnerId,
      },
    });

    console.log("✅ Found equipments:", equipments.length);

    res.json({
      success: true,
      message: `Found ${equipments.length} equipment(s) in category: ${category}`,
      data: equipments,
    });
  } catch (error) {
    console.error("❌ Error fetching equipment by category:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching equipment by category",
      error: error.message,
    });
  }
};

export const getEquipmentByNumber = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;
    const { equipment_number } = req.params;

    const equipment = await Equipment.findOne({
      where: { equipment_number, gym_owner_id: gymOwnerId },
    });

    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }

    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipment by number",
      error: error.message,
    });
  }
};

export const getEquipmentByCategoryForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const gymOwnerId = req.user.gymOwnerId;
    const { category } = req.query;

    console.log("🔍 User searching for category:", category);
    console.log("🔍 User ID:", userId);
    console.log("🔍 User's Gym Owner ID:", gymOwnerId);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required",
        data: null,
      });
    }

    // Fetch both gym owner's equipment and user's personal equipment in the specified category
    const equipments = await Equipment.findAll({
      where: {
        category: {
          [Op.like]: category, // Case-insensitive match
        },
        [Op.or]: [
          { gym_owner_id: gymOwnerId }, // Gym owner's equipment
          { user_id: userId }, // User's personal equipment
        ],
      },
      order: [["timestamp", "DESC"]],
    });

    console.log("✅ Found equipments for user:", equipments.length);

    res.json({
      success: true,
      message: `Found ${equipments.length} equipment(s) in category: ${category}`,
      data: equipments,
    });
  } catch (error) {
    console.error("❌ Error fetching equipment by category for user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching equipment by category",
      error: error.message,
    });
  }
};

// ==================== USER EQUIPMENT OPERATIONS ====================

// Create Equipment by User
export const createUserEquipment = async (req, res) => {
  try {
    const userId = req.user.id;
    const gymOwnerId = req.user.gymOwnerId;
    const { equipment_name, category } = req.body;
    console.log("User Equipment Creation:", req.body);
    const file = req.file;

    if (!equipment_name) {
      return res.status(400).json({
        success: false,
        message: "Equipment name is required",
      });
    }

    // Auto-generate equipment number: Count total equipment (gym owner + user equipment) and add 1
    const totalEquipmentCount = await Equipment.count({
      where: {
        [Op.or]: [
          { gym_owner_id: gymOwnerId }, // Gym owner's equipment
          { user_id: userId }            // User's personal equipment
        ]
      }
    });

    const equipment_number = (totalEquipmentCount + 1).toString();

    // Try to upload image to S3 (if file exists)
    let imageUrl = null;
    if (file) {
      try {
        imageUrl = await uploadToS3(file, "equipment");
        if (!imageUrl) {
          console.warn(
            "⚠️ S3 upload returned null, proceeding with null image"
          );
        }
      } catch (error) {
        console.error(
          "⚠️ S3 upload failed, proceeding with null image:",
          error.message
        );
      }
    }

    // Create equipment for user
    const newEquipment = await Equipment.create({
      equipment_name,
      category,
      equipment_number,
      equipment_image: imageUrl,
      user_id: userId,
      gym_owner_id: null, // User equipment doesn't belong to gym owner
    });

    res.status(201).json({
      success: true,
      message: "Equipment created successfully",
      data: newEquipment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create equipment",
      error: error.message,
    });
  }
};

// Update Equipment by User
export const updateUserEquipment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { equipment_name, category, equipment_number } = req.body;
    const file = req.file;

    const equipment = await Equipment.findOne({
      where: { id, user_id: userId },
    });

    if (!equipment) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Equipment not found or you don't have permission to update it",
        });
    }

    // Check if equipment number is being changed to a number that already exists
    if (equipment_number && equipment_number !== equipment.equipment_number) {
      const existingEquipment = await Equipment.findOne({
        where: {
          equipment_number,
          user_id: userId,
          id: { [Op.ne]: id }, // Exclude the current equipment
        },
      });

      if (existingEquipment) {
        return res.status(400).json({
          success: false,
          message: `Equipment number "${equipment_number}" already exists. Please use a unique number.`,
        });
      }
    }

    // Keep existing image if no new file uploaded
    let imageUrl = equipment.equipment_image;

    // Try to upload new image to S3 (if file exists)
    if (file) {
      try {
        const newImageUrl = await uploadToS3(file, "equipment");
        if (newImageUrl) {
          imageUrl = newImageUrl;
        } else {
          console.warn("⚠️ S3 upload returned null, keeping existing image");
        }
      } catch (error) {
        console.error(
          "⚠️ S3 upload failed, keeping existing image:",
          error.message
        );
      }
    }

    await equipment.update({
      equipment_name: equipment_name || equipment.equipment_name,
      category: category || equipment.category,
      equipment_number: equipment_number || equipment.equipment_number,
      equipment_image: imageUrl,
    });

    // Reload to get fresh data
    await equipment.reload();

    res.json({
      success: true,
      message: "Equipment updated successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update equipment",
      error: error.message,
    });
  }
};

// Delete Equipment by User
export const deleteUserEquipment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const equipment = await Equipment.findOne({
      where: { id, user_id: userId },
    });

    if (!equipment) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Equipment not found or you don't have permission to delete it",
        });
    }

    await equipment.destroy();

    res.json({
      success: true,
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete equipment",
      error: error.message,
    });
  }
};

// Get Single Equipment by User
export const getUserEquipmentById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const equipment = await Equipment.findOne({
      where: { id, user_id: userId },
    });

    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }

    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipment",
      error: error.message,
    });
  }
};
