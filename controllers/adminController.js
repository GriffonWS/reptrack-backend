import Admin from "../models/adminModels.js";
import jwt from "jsonwebtoken";

const adminController = {
  // Register Admin
  registerAdmin: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
          data: null,
        });
      }

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "Admin with this email already exists",
          data: null,
        });
      }

      // Create new admin
      const admin = new Admin({
        firstName,
        lastName,
        email,
        password,
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      admin.token = token;
      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Admin registered successfully",
        data: {
          ...admin.toJSON(),
          token,
        },
      });
    } catch (error) {
      console.error("Register Admin Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  // Login Admin
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
          data: null,
        });
      }

      // Check if admin exists
      const admin = await Admin.findOne({ email }).select("+password"); // include password
      if (!admin) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
          data: null,
        });
      }

      // Compare password
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
          data: null,
        });
      }

      // Generate new JWT token
      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      admin.token = token;
      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          ...admin.toJSON(),
          token,
        },
      });
    } catch (error) {
      console.error("Login Admin Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  //   Get Admin Details by email id

  getAdminByEmail: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
          data: null,
        });
      }

      // Find admin by email
      const admin = await Admin.findOne({ email }).select("-password"); // exclude password for safety

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Admin fetched successfully",
        data: admin,
      });
    } catch (error) {
      console.error("Get Admin Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }
  },

  // Update Admin
  updateAdmin: async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required to update admin",
          data: null,
        });
      }

      // Find the admin
      const admin = await Admin.findOne({ email }).select("+password");
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
          data: null,
        });
      }

      // Update fields if provided
      if (firstName) admin.firstName = firstName;
      if (lastName) admin.lastName = lastName;
      if (password) admin.password = password; // Will be hashed by pre-save hook

      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Admin updated successfully",
        data: admin.toJSON(),
      });
    } catch (error) {
      console.error("Update Admin Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  //   Logout Admin

  logoutAdmin: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required to logout",
          data: null,
        });
      }

      // Find the admin
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
          data: null,
        });
      }

      // Clear the token
      admin.token = null;
      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Logout successful",
        data: null,
      });
    } catch (error) {
      console.error("Logout Admin Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },
};

export default adminController;
