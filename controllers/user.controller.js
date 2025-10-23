import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Register User (Gym Owner only)
export const registerUser = async (req, res) => {
  try {
    const token = req.token;
    const {
      firstName,
      lastName,
      phone,
      email,
      subscriptionType,
      dateOfJoining,
      dateOfBirth,
      gender,
      healthInfo,
      weight,
      deviceToken,
      firebaseToken
    } = req.body;

    // Verify if requester is Gym Owner (check from Admin table)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ where: { id: decoded.id, token } });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Only Gym Owners can register users.',
        data: null
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists',
        data: null
      });
    }

    // Handle profile image
    const profileImage = req.file ? req.file.filename : null;

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      phone,
      email,
      gymOwnerId: admin.id,
      subscriptionType,
      dateOfJoining,
      dateOfBirth,
      gender,
      healthInfo,
      weight,
      profileImage,
      deviceToken,
      firebaseToken
    });

    // Remove sensitive data
    const userData = user.toJSON();
    delete userData.otp;
    delete userData.token;

    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
      data: userData
    });
  } catch (error) {
    console.error('Register user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { uniqueId, phone, deviceToken } = req.body;

    if (!uniqueId || !phone) {
      return res.status(400).json({
        success: false,
        message: 'UniqueId and phone are required',
        data: null
      });
    }

    // Find user
    const user = await User.findOne({ where: { uniqueId, phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'User account is deactivated',
        data: null
      });
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpTimestamp = new Date();
    if (deviceToken) user.deviceToken = deviceToken;
    await user.save();

    // In production, send OTP via SMS
    console.log(`OTP for ${phone}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phone: user.phone,
        otpSent: true,
        // For testing only - remove in production
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
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

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { otp, phone } = req.body;

    if (!otp || !phone) {
      return res.status(400).json({
        success: false,
        message: 'OTP and phone are required',
        data: null
      });
    }

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Check OTP expiry (5 minutes)
    const otpAge = (new Date() - new Date(user.otpTimestamp)) / 1000 / 60;
    if (otpAge > 5) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request a new one.',
        data: null
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        data: null
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Update user
    user.token = token;
    user.status = true;
    user.otp = null;
    await user.save();

    const userData = user.toJSON();
    delete userData.otp;
    delete userData.otpTimestamp;
    userData.token = token;

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: userData
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Update User Profile
export const updateUser = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.admin.id;
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      emergencyPhone,
      height,
      weight,
      gender
    } = req.body;

    const user = await User.findOne({ where: { id: userId, token } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (emergencyPhone !== undefined) user.emergencyPhone = emergencyPhone;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (gender !== undefined) user.gender = gender;
    if (req.file) user.profileImage = req.file.filename;
    
    user.isProfileUpdated = true;
    await user.save();

    const userData = user.toJSON();
    delete userData.otp;
    delete userData.token;

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: userData
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpTimestamp = new Date();
    await user.save();

    console.log(`New OTP for ${phone}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        phone: user.phone,
        otpSent: true,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.admin.id;

    const user = await User.findOne({ where: { id: userId, token } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    user.token = null;
    user.status = false;
    await user.save();

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

// Delete User (soft delete - set active to false)
export const deleteUser = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.admin.id;

    const user = await User.findOne({ where: { id: userId, token } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    user.active = false;
    user.token = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: user
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Remove User (hard delete)
export const removeUser = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.admin.id;

    const user = await User.findOne({ where: { id: userId, token } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: 'User removed successfully',
      data: null
    });
  } catch (error) {
    console.error('Remove user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Get User Profile
export const getUser = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.admin.id;

    const user = await User.findOne({ where: { id: userId, token } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    const userData = user.toJSON();
    delete userData.otp;
    delete userData.token;

    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: userData
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Get All Users (Gym Owner)
export const getAllUsers = async (req, res) => {
  try {
    const token = req.token;
    const { page = 0, size = 10 } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ where: { id: decoded.id, token } });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const offset = parseInt(page) * parseInt(size);
    const limit = parseInt(size);

    const { count, rows } = await User.findAndCountAll({
      where: { gymOwnerId: admin.id },
      limit,
      offset,
      order: [['id', 'DESC']]
    });

    // Remove sensitive data
    const users = rows.map(user => {
      const userData = user.toJSON();
      delete userData.otp;
      delete userData.token;
      return userData;
    });

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        content: users,
        totalElements: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        size: parseInt(size)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Get User By ID (Gym Owner)
export const getUserById = async (req, res) => {
  try {
    const token = req.token;
    const { id } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ where: { id: decoded.id, token } });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const user = await User.findOne({ 
      where: { id, gymOwnerId: admin.id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    const userData = user.toJSON();
    delete userData.otp;
    delete userData.token;

    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: [userData]
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Update User By ID (Gym Owner)
export const updateUserById = async (req, res) => {
  try {
    const token = req.token;
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phone,
      email,
      subscriptionType,
      dateOfJoining,
      dateOfBirth,
      emergencyPhone,
      healthInfo,
      height,
      weight,
      gender,
      active
    } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ where: { id: decoded.id, token } });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const user = await User.findOne({ 
      where: { id, gymOwnerId: admin.id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (email !== undefined) user.email = email;
    if (subscriptionType !== undefined) user.subscriptionType = subscriptionType;
    if (dateOfJoining !== undefined) user.dateOfJoining = dateOfJoining;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (emergencyPhone !== undefined) user.emergencyPhone = emergencyPhone;
    if (healthInfo !== undefined) user.healthInfo = healthInfo;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (gender !== undefined) user.gender = gender;
    if (active !== undefined) user.active = active;
    if (req.file) user.profileImage = req.file.filename;

    await user.save();

    const userData = user.toJSON();
    delete userData.otp;
    delete userData.token;

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: userData
    });
  } catch (error) {
    console.error('Update user by ID error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};

// Remove User By ID (Gym Owner)
export const removeUserById = async (req, res) => {
  try {
    const token = req.token;
    const { id } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ where: { id: decoded.id, token } });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null
      });
    }

    const user = await User.findOne({ 
      where: { id, gymOwnerId: admin.id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: 'User removed successfully',
      data: null
    });
  } catch (error) {
    console.error('Remove user by ID error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      data: null
    });
  }
};