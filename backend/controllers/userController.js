import { User } from "../models/userModels.js";
import { v4 as uuidv4 } from "uuid"; // for uniqueId generation
import { uploadToS3 } from "../utils/uploadToS3.js"; // ✅ importing uploadToS3

export const registerUser = async (req, res) => {
  try {
    // Upload image to S3 (if provided)
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    // Build user object
    const userData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: imageUrl || null, // Save null if upload failed
    };

    // Save user to database
    const newUser = await User.create(userData);

    res.status(201).json({
      message: "✅ User registered successfully",
      user: newUser,
      imageUpload: imageUrl
        ? "✅ Image uploaded to S3"
        : "⚠️ Image upload failed or skipped",
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

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

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🧾 req.body =>", req.body);
    console.log("📸 req.file =>", req.file);

    const body = req.body || {};
    const {
      firstName,
      lastName,
      phone,
      email,
      subscriptionType,
      dateOfJoining,
      dateOfBirth,
      gender,
      emergencyPhone,
      healthInfo,
      height,
      weight,
      active,
    } = body;

    let profileImageUrl = null;
    if (req.file) {
      profileImageUrl = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByPk(parseInt(id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (subscriptionType) updateData.subscriptionType = subscriptionType;
    if (dateOfJoining) updateData.dateOfJoining = dateOfJoining;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (emergencyPhone) updateData.emergencyPhone = emergencyPhone;
    if (healthInfo) updateData.healthInfo = healthInfo;
    if (height) updateData.height = height;
    if (weight) updateData.weight = weight;
    if (profileImageUrl) updateData.profileImage = profileImageUrl;
    if (active !== undefined) updateData.active = active;
    updateData.isProfileUpdated = true;

    await user.update(updateData);

    const updatedUser = await User.findByPk(parseInt(id));
    res
      .status(200)
      .json({ message: "✅ User updated successfully", data: updatedUser });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user exists
    const user = await User.findByPk(parseInt(id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user from database
    await user.destroy();

    res.status(200).json({
      message: "✅ User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
