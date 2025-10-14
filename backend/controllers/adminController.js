import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModels.js";
import { generateToken } from "../utils/generateToken.js";

export const registerAdmin = async (req, res) => {
  try {
    const { email, firstname, lastname, password, role } = req.body;

    if (!email || !firstname || !lastname || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token first
    const token = generateToken({
      email,
      role,
    });

    // Create new admin with token
    const newAdmin = await Admin.create({
      email,
      firstname,
      lastname,
      password: hashedPassword,
      role,
      token, // ✅ Save token to database
      timestamp: new Date(), // ✅ Set timestamp
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        firstname: newAdmin.firstname,
        lastname: newAdmin.lastname,
        role: newAdmin.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error in registerAdmin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    // Save token in DB
    admin.token = token;
    await admin.save();

    // Send response
    return res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin.id,
        email: admin.email,
        firstname: admin.firstname,
        lastname: admin.lastname,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error in loginAdmin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminByToken = async (req, res) => {
  try {
    // Get token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin by decoded info
    const admin = await Admin.findOne({
      where: { email: decoded.email },
      attributes: ["id", "email", "firstname", "lastname", "role"],
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Return admin info
    return res.status(200).json({
      message: "Admin fetched successfully",
      admin,
    });
  } catch (error) {
    console.error("❌ Error in getAdminByToken:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const updateAdminByToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin by decoded email
    const admin = await Admin.findOne({ where: { email: decoded.email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { firstname, lastname, password, role } = req.body;

    // Update allowed fields
    if (firstname) admin.firstname = firstname;
    if (lastname) admin.lastname = lastname;
    if (role) admin.role = role;

    // Hash password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    // Save changes
    await admin.save();

    return res.status(200).json({
      message: "Admin profile updated successfully",
      admin: {
        id: admin.id,
        email: admin.email, // email not editable
        firstname: admin.firstname,
        lastname: admin.lastname,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("❌ Error in updateAdminByToken:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin by token or email
    const admin = await Admin.findOne({ where: { email: decoded.email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Clear token from DB
    admin.token = null;
    await admin.save();

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Error in logoutAdmin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
