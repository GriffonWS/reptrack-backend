import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        data: null
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists',
        data: null
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    // Remove password from response
    const adminData = admin.toJSON();
    delete adminData.password;

    return res.status(200).json({
      success: true,
      message: 'Admin registered successfully',
      data: adminData
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        data: null
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email,
        role: admin.role || 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Save token to database
    admin.token = token;
    await admin.save();

    // Remove password from response
    const adminData = admin.toJSON();
    delete adminData.password;
    adminData.token = token;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: adminData
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Get Admin by Token
export const getAdminByToken = async (req, res) => {
  try {
    const token = req.token;
    const adminId = req.admin.id;
    
    // Find admin by ID and verify token
    const admin = await Admin.findOne({ 
      where: { 
        id: adminId,
        token: token 
      }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found or invalid token',
        data: null
      });
    }

    // Remove password from response
    const adminData = admin.toJSON();
    delete adminData.password;

    return res.status(200).json({
      success: true,
      message: 'Admin retrieved successfully',
      data: adminData
    });
  } catch (error) {
    console.error('Get admin error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Update Admin by Token
export const updateAdminByToken = async (req, res) => {
  try {
    const token = req.token;
    const adminId = req.admin.id;
    const updatedData = req.body;
    
    // Ensure email and password cannot be updated through this endpoint
    delete updatedData.email;
    delete updatedData.password;
    delete updatedData.token;
    delete updatedData.role;
    delete updatedData.id;
    
    // Find admin by ID and verify token
    const admin = await Admin.findOne({ 
      where: { 
        id: adminId,
        token: token 
      }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found or invalid token',
        data: null
      });
    }

    // Update allowed fields
    if (updatedData.firstName !== undefined) admin.firstName = updatedData.firstName;
    if (updatedData.lastName !== undefined) admin.lastName = updatedData.lastName;

    await admin.save();

    // Remove password from response
    const adminData = admin.toJSON();
    delete adminData.password;

    return res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: adminData
    });
  } catch (error) {
    console.error('Update admin error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const token = req.token;
    const adminId = req.admin.id;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    
    // Validate required fields
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required',
        data: null
      });
    }

    // Validate new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match',
        data: null
      });
    }

    // Find admin
    const admin = await Admin.findOne({ 
      where: { 
        id: adminId,
        token: token 
      }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found or invalid token',
        data: null
      });
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect',
        data: null
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    // Remove password from response
    const adminData = admin.toJSON();
    delete adminData.password;

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: adminData
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const token = req.token;
    const adminId = req.admin.id;
    
    // Find admin
    const admin = await Admin.findOne({ 
      where: { 
        id: adminId,
        token: token 
      }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
        data: null
      });
    }

    // Clear token
    admin.token = null;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
      data: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};