import { User } from "../models/userModels.js";

export const getAllUsers = async (req, res) => {
  try {
    const { limit, offset = 0, sortBy = "id", order = "DESC" } = req.query;

    // Build options object for Sequelize
    const options = {
      attributes: [
        "id",
        "firstName",
        "lastName",
        "phone",
        "email",
        "uniqueId",
        "gymOwnerId",
        "subscriptionType",
        "dateOfJoining",
        "dateOfBirth",
        "gender",
        "emergencyPhone",
        "healthInfo",
        "height",
        "weight",
        "profileImage",
        "status",
        "active",
        "isProfileUpdated",
        "timestamp",
      ],
      order: [[sortBy, order]],
      offset: parseInt(offset),
    };

    // Add limit if provided
    if (limit) {
      options.limit = parseInt(limit);
    }

    // Fetch users from database
    const { count, rows } = await User.findAndCountAll(options);

    // Return success response
    res.status(200).json({
      message: "Users fetched successfully",
      total: count,
      limit: limit ? parseInt(limit) : count,
      offset: parseInt(offset),
      data: rows,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id parameter
    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // Fetch user from database
    const user = await User.findOne({
      where: { id: parseInt(id) },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "phone",
        "email",
        "uniqueId",
        "gymOwnerId",
        "subscriptionType",
        "dateOfJoining",
        "dateOfBirth",
        "gender",
        "emergencyPhone",
        "healthInfo",
        "height",
        "weight",
        "profileImage",
        "status",
        "active",
        "isProfileUpdated",
        "timestamp",
      ],
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Return success response
    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};
