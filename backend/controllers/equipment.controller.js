import Equipment from "../models/equipment.model.js";
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const createEquipment = async (req, res) => {
  try {
    const token = req.token;
    const { equipment_name, category, equipment_number } = req.body;
    const file = req.file;

    // Verify admin token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ where: { id: decoded.id, token } });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Only authorized users can create equipment.",
      });
    }

    if (!equipment_name || !equipment_number) {
      return res.status(400).json({
        success: false,
        message: "Equipment name and number are required",
      });
    }

    // Try to upload image to S3 (if file exists)
    let imageUrl = null;
    if (file) {
      try {
        imageUrl = await uploadToS3(file);
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
      gym_owner_id: admin.id,
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
    const token = req.token;
    const { id } = req.params;
    const { equipment_name, category, equipment_number } = req.body;
    const file = req.file;

    // Verify admin token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ where: { id: decoded.id, token } });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Only authorized users can update equipment.",
      });
    }

    const equipment = await Equipment.findByPk(id);
    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }

    // Keep existing image if no new file uploaded
    let imageUrl = equipment.equipment_image;

    // Try to upload new image to S3 (if file exists)
    if (file) {
      try {
        const newImageUrl = await uploadToS3(file);
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
    const token = req.token;
    const { id } = req.params;

    // Verify admin token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ where: { id: decoded.id, token } });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Only authorized users can delete equipment.",
      });
    }

    const equipment = await Equipment.findByPk(id);
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
    const { id } = req.params;
    const equipment = await Equipment.findByPk(id);
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

export const getAllEquipment = async (req, res) => {
  try {
    const token = req.token;

    // Verify admin token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ where: { id: decoded.id, token } });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const equipments = await Equipment.findAll({
      where: { gym_owner_id: admin.id },
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

export const getEquipmentByCategory = async (req, res) => {
  try {
    const token = req.token;
    const { category } = req.query;

    // Verify admin token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ where: { id: decoded.id, token } });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const equipments = await Equipment.findAll({
      where: { category, gym_owner_id: admin.id },
    });

    res.json({ success: true, data: equipments });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching equipment by category",
      error: error.message,
    });
  }
};

export const getEquipmentByNumber = async (req, res) => {
  try {
    const { equipment_number } = req.params;
    const equipment = await Equipment.findOne({
      where: { equipment_number },
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
