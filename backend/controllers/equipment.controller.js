import Equipment from "../models/equipment.model.js";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

export const createEquipment = async (req, res) => {
  try {
    const { equipmentName, category, equipmentNumber } = req.body;
    const file = req.file;
    const tokenData = req.admin;

    if (tokenData.role !== "Gym_Owner") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!equipmentName || !equipmentNumber) {
      return res.status(400).json({
        success: false,
        message: "Equipment name and number are required",
      });
    }

    let imagePath = null;
    if (file) {
      imagePath = `/uploads/${file.filename}`;
    }

    const newEquipment = await Equipment.create({
      equipmentName,
      category,
      equipmentNumber,
      equipmentImage: imagePath,
      gymOwnerId: tokenData.id,
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
    const { id } = req.params;
    const { equipmentName, category, equipmentNumber } = req.body;
    const file = req.file;
    const tokenData = req.admin;

    if (tokenData.role !== "Gym_Owner") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const equipment = await Equipment.findByPk(id);
    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }

    let imagePath = equipment.equipmentImage;
    if (file) {
      imagePath = `/uploads/${file.filename}`;
    }

    await equipment.update({
      equipmentName,
      category,
      equipmentNumber,
      equipmentImage: imagePath,
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
    const { id } = req.params;
    const tokenData = req.admin;

    if (tokenData.role !== "Gym_Owner") {
      return res.status(403).json({ success: false, message: "Access denied" });
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
    const tokenData = req.admin;

    if (tokenData.role !== "Gym_Owner") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const equipments = await Equipment.findAll({
      where: { gymOwnerId: tokenData.id },
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
    const { category } = req.query;
    const tokenData = req.admin;

    if (tokenData.role !== "Gym_Owner") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const equipments = await Equipment.findAll({
      where: { category, gymOwnerId: tokenData.id },
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
    const { equipmentNumber } = req.params;
    const equipment = await Equipment.findOne({
      where: { equipmentNumber },
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
