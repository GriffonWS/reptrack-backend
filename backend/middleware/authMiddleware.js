// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModels.js";

export const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if admin exists and token matches
    const admin = await Admin.findOne({
      where: { id: decoded.id, token: token },
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid token or admin not found.",
      });
    }

    // Check if admin role
    if (admin.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin role required.",
      });
    }

    // Attach admin to request object
    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    console.error("❌ Authentication error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired.",
      });
    }

    return res.status(500).json({
      message: "Authentication failed.",
      error: error.message,
    });
  }
};
