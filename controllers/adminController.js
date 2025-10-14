import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModels.js";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validators.js";

// Token blacklist (in production, use Redis)
const tokenBlacklist = new Set();

export const registerAdmin = async (req, res) => {
  try {
    const { email, firstname, lastname, password, role } = req.body;

    // Validate all fields
    if (!email || !firstname || !lastname || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate names
    if (!validateName(firstname) || !validateName(lastname)) {
      return res
        .status(400)
        .json({
          message: "Names must be between 2 and 50 characters",
        });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      });
    }

    // Validate role
    const validRoles = ["admin", "superadmin", "moderator"];
    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json({
          message: `Invalid role. Allowed roles: ${validRoles.join(", ")}`,
        });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin (DO NOT store token in DB)
    const newAdmin = await Admin.create({
      email,
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    // Generate tokens
    const token = generateToken({
      id: newAdmin.id,
      email: newAdmin.email,
      role: newAdmin.role,
    });

    const refreshToken = generateRefreshToken({
      id: newAdmin.id,
      email: newAdmin.email,
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
      refreshToken,
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

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const refreshToken = generateRefreshToken({
      id: admin.id,
      email: admin.email,
    });

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
      refreshToken,
    });
  } catch (error) {
    console.error("❌ Error in loginAdmin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    // req.user is set by verifyToken middleware
    const admin = await Admin.findOne({
      where: { id: req.user.id },
      attributes: ["id", "email", "firstname", "lastname", "role", "timestamp"],
      raw: true,
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({
      message: "Admin profile retrieved successfully",
      admin,
    });
  } catch (error) {
    console.error("❌ Error in getAdminProfile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const updateAdminProfile = async (req, res) => {
  try {
    // req.user is set by verifyToken middleware
    const admin = await Admin.findOne({ where: { id: req.user.id } });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { firstname, lastname, password, role } = req.body;

    // Update firstname
    if (firstname) {
      if (!validateName(firstname)) {
        return res
          .status(400)
          .json({
            message: "First name must be between 2 and 50 characters",
          });
      }
      admin.firstname = firstname.trim();
    }

    // Update lastname
    if (lastname) {
      if (!validateName(lastname)) {
        return res
          .status(400)
          .json({
            message: "Last name must be between 2 and 50 characters",
          });
      }
      admin.lastname = lastname.trim();
    }

    // Update password
    if (password) {
      if (!validatePassword(password)) {
        return res.status(400).json({
          message:
            "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character",
        });
      }
      admin.password = await bcrypt.hash(password, 10);
    }

    // Update role (only superadmin can change roles)
    if (role) {
      if (req.user.role !== "superadmin") {
        return res
          .status(403)
          .json({ message: "Only superadmins can change roles" });
      }
      const validRoles = ["admin", "superadmin", "moderator"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      admin.role = role;
    }

    // Save changes
    await admin.save();

    return res.status(200).json({
      message: "Admin profile updated successfully",
      admin: {
        id: admin.id,
        email: admin.email,
        firstname: admin.firstname,
        lastname: admin.lastname,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("❌ Error in updateAdminProfile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const logoutAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // Add token to blacklist
    tokenBlacklist.add(token);

    // Optional: Set expiration timer for cleanup
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp * 1000 - Date.now();
    setTimeout(() => tokenBlacklist.delete(token), expiresIn);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Error in logoutAdmin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find admin
    const admin = await Admin.findOne({
      where: { id: decoded.id },
      attributes: ["id", "email", "role"],
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Generate new token
    const newToken = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    console.error("❌ Error in refreshTokenHandler:", error);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};
