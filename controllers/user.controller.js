import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { sendOTP } from "../config/twilio.js";
import { sendInvitationEmail, sendWelcomeEmail, sendForgotPasswordEmail } from "../nodemailer/emails.js";
import transporter from "../nodemailer/config.js";

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Helper function to generate password reset token
const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Register User (Gym Owner only)
export const registerUser = async (req, res) => {
  try {
    console.log("=== REGISTER USER START ===");
    console.log("📋 Request body keys:", Object.keys(req.body));
    console.log("📎 req.file exists:", !!req.file);
    console.log("📎 req.files exists:", !!req.files);

    const gymOwnerId = req.gymOwner.id;
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
      firebaseToken,
    } = req.body;

    // Check if user already exists by email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email address already exists",
        data: null,
      });
    }

    // Handle profile image upload to S3
    let profileImageUrl = null;
    console.log("📝 Register request - File received:", req.file ? "YES" : "NO");

    if (req.file) {
      console.log("📁 File details:", {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer ? `EXISTS (${req.file.buffer.length} bytes)` : "MISSING"
      });

      console.log("🔧 AWS Config check:");
      console.log("  - AWS_S3_BUCKET_NAME:", process.env.AWS_S3_BUCKET_NAME ? "SET" : "MISSING");
      console.log("  - AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID ? "SET" : "MISSING");
      console.log("  - AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY ? "SET" : "MISSING");
      console.log("  - AWS_REGION:", process.env.AWS_REGION || "NOT SET");

      try {
        console.log("🚀 Starting S3 upload...");
        profileImageUrl = await uploadToS3(req.file, "users/profiles");
        console.log("📤 uploadToS3 returned:", profileImageUrl);

        if (!profileImageUrl) {
          console.warn("⚠️ Profile image upload returned null");
        } else {
          console.log("✅ Profile image uploaded successfully:", profileImageUrl);
        }
      } catch (error) {
        console.error("❌ Profile image upload failed:", error.message);
        console.error("Full error:", error);
        console.error("Error stack:", error.stack);
      }
    } else {
      console.log("ℹ️ No profile image provided in request");
    }

    console.log("💾 Creating user with profileImage:", profileImageUrl);

    // Generate random password (3 characters + @ + 3 numbers)
    const generateRandomPassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';

      let password = '';
      for (let i = 0; i < 3; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      password += '@';
      for (let i = 0; i < 3; i++) {
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      return password;
    };

    const plainPassword = generateRandomPassword();
    console.log("🔐 Generated password for user");

    // Hash the password
    const hashedPassword = await bcryptjs.hash(plainPassword, 10);

    // Create user with password and isNewUser flag
    const user = await User.create({
      firstName,
      lastName,
      phone,
      email,
      gymOwnerId,
      subscriptionType,
      dateOfJoining,
      dateOfBirth,
      gender,
      healthInfo,
      weight,
      profileImage: profileImageUrl,
      deviceToken,
      firebaseToken,
      password: hashedPassword,
      isNewUser: true, // Set as new user
    });

    console.log("✅ User created with ID:", user.id);
    console.log("📷 User profileImage value:", user.profileImage);

    // Send welcome email with login credentials
    try {
      const androidLink = process.env.ANDROID_APP_URL || "https://play.google.com/store/apps/details?id=com.reptrack";
      const iosLink = process.env.IOS_APP_URL || "https://apps.apple.com/app/reptrack";

      const userName = `${firstName} ${lastName}`;
      await sendWelcomeEmail(email, userName, user.uniqueId, email, plainPassword, androidLink, iosLink);
      console.log("✅ Welcome email sent to:", email);
    } catch (emailError) {
      console.error("⚠️ Failed to send welcome email:", emailError.message);
      // Don't fail the registration if email fails, just log it
    }

    // Remove sensitive data
    const userData = user.toJSON();
    delete userData.otp;
    delete userData.token;
    delete userData.password;
    delete userData.passwordResetToken;
    delete userData.passwordResetExpires;

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Register user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
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
        message: "UniqueId and phone are required",
        data: null,
      });
    }

    // Debug logging
    console.log('🔍 Login attempt:');
    console.log('  UniqueId:', uniqueId);
    console.log('  Phone:', phone);

    // Find user
    const user = await User.findOne({ where: { uniqueId, phone } });

    if (!user) {
      console.log('❌ User not found with uniqueId:', uniqueId, 'and phone:', phone);

      // Check if user exists with uniqueId only
      const userByUniqueId = await User.findOne({ where: { uniqueId } });
      if (userByUniqueId) {
        console.log('⚠️ User found with uniqueId but phone mismatch!');
        console.log('  Stored phone:', userByUniqueId.phone);
        console.log('  Provided phone:', phone);
      }

      // Check if user exists with phone only
      const userByPhone = await User.findOne({ where: { phone } });
      if (userByPhone) {
        console.log('⚠️ User found with phone but uniqueId mismatch!');
        console.log('  Stored uniqueId:', userByPhone.uniqueId);
        console.log('  Provided uniqueId:', uniqueId);
      }

      return res.status(404).json({
        success: false,
        message: "User not found with provided uniqueId and phone combination",
        data: null,
      });
    }

    console.log('✅ User found:', user.id);

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: "User account is deactivated",
        data: null,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpTimestamp = new Date();
    if (deviceToken) user.deviceToken = deviceToken;
    await user.save();

    // Send OTP via Twilio SMS
    try {
      // Ensure phone number has country code
      let formattedPhone = phone;
      if (!phone.startsWith("+")) {
        // Add +1 for US numbers by default (change based on your country)
        formattedPhone = `+91${phone}`;
      }

      await sendOTP(formattedPhone, otp);
      console.log(`✅ OTP sent to ${formattedPhone}: ${otp}`);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your phone",
        data: {
          phone: user.phone,
          otpSent: true,
          // For testing only - remove in production
          otp: process.env.NODE_ENV === "development" ? otp : undefined,
        },
      });
    } catch (smsError) {
      console.error("⚠️ Failed to send SMS:", smsError.message);

      // Still return success with OTP in development mode
      if (process.env.NODE_ENV === "development") {
        console.log(`⚠️ Development mode: OTP is ${otp}`);
        return res.status(200).json({
          success: true,
          message: "OTP generated (SMS failed, check console)",
          data: {
            phone: user.phone,
            otpSent: false,
            otp: otp, // Only in development
          },
        });
      }

      // In production, return error
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
        data: null,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Verify OTP
// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { otp, phone } = req.body;

    if (!otp || !phone) {
      return res.status(400).json({
        success: false,
        message: "OTP and phone are required",
        data: null,
      });
    }

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Check OTP expiry (5 minutes)
    const otpAge = (new Date() - new Date(user.otpTimestamp)) / 1000 / 60;
    if (otpAge > 5) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
        data: null,
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        data: null,
      });
    }

    // Generate JWT token - ✅ FIXED: Added gymOwnerId
    const token = jwt.sign(
      { 
        id: user.id, 
        phone: user.phone, 
        gymOwnerId: user.gymOwnerId, // ✅ Add this line!
        role: "user" 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
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
      message: "OTP verified successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Update User Profile
export const updateUser = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      emergencyPhone,
      height,
      weight,
      gender,
    } = req.body;

    const user = await User.findOne({ where: { id: userId, token } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
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

    // Handle profile image upload to S3
    if (req.file) {
      try {
        const profileImageUrl = await uploadToS3(req.file, "users/profiles");
        if (profileImageUrl) {
          user.profileImage = profileImageUrl;
        } else {
          console.warn(
            "⚠️ Profile image upload returned null, keeping existing image"
          );
        }
      } catch (error) {
        console.error(
          "⚠️ Profile image upload failed, keeping existing image:",
          error.message
        );
      }
    }

    user.isProfileUpdated = true;
    await user.save();

    const userData = user.toJSON();
    delete userData.otp;
    delete userData.token;

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
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
        message: "User not found",
        data: null,
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpTimestamp = new Date();
    await user.save();

    // Send OTP via Twilio SMS
    try {
      // Ensure phone number has country code
      let formattedPhone = phone;
      if (!phone.startsWith("+")) {
        // Add +91 for Indian numbers (change based on your country)
        formattedPhone = `+91${phone}`;
      }

      await sendOTP(formattedPhone, otp);
      console.log(`✅ OTP resent to ${formattedPhone}: ${otp}`);

      return res.status(200).json({
        success: true,
        message: "OTP resent successfully to your phone",
        data: {
          phone: user.phone,
          otpSent: true,
          otp: process.env.NODE_ENV === "development" ? otp : undefined,
        },
      });
    } catch (smsError) {
      console.error("⚠️ Failed to send SMS:", smsError.message);

      // Still return success with OTP in development mode
      if (process.env.NODE_ENV === "development") {
        console.log(`⚠️ Development mode: OTP is ${otp}`);
        return res.status(200).json({
          success: true,
          message: "OTP generated (SMS failed, check console)",
          data: {
            phone: user.phone,
            otpSent: false,
            otp: otp, // Only in development
          },
        });
      }

      // In production, return error
      return res.status(500).json({
        success: false,
        message: "Failed to resend OTP. Please try again.",
        data: null,
      });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.user.id;

    const user = await User.findOne({ where: { id: userId, token } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    user.token = null;
    user.status = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logout successful",
      data: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Delete User (soft delete - set active to false)
export const deleteUser = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.user.id;

    const user = await User.findOne({ where: { id: userId, token } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    user.active = false;
    user.token = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Remove User (hard delete)
export const removeUser = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.user.id;

    const user = await User.findOne({ where: { id: userId, token } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User removed successfully",
      data: null,
    });
  } catch (error) {
    console.error("Remove user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Get User Profile
export const getUser = async (req, res) => {
  try {
    const token = req.token;
    const userId = req.user.id;

    const user = await User.findOne({ where: { id: userId, token } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const userData = user.toJSON();
    delete userData.otp;
    delete userData.token;

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Get All Users (Gym Owner)
export const getAllUsers = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;
    const { page = 0, size = 10 } = req.query;

    const offset = parseInt(page) * parseInt(size);
    const limit = parseInt(size);

    const { count, rows } = await User.findAndCountAll({
      where: { gymOwnerId },
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    // Remove sensitive data
    const users = rows.map((user) => {
      const userData = user.toJSON();
      delete userData.otp;
      delete userData.token;
      return userData;
    });

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        content: users,
        totalElements: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        size: parseInt(size),
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Get User By ID (Gym Owner)
export const getUserById = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;
    const { id } = req.params;

    const user = await User.findOne({
      where: { id, gymOwnerId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const userData = user.toJSON();
    delete userData.otp;
    delete userData.token;

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: [userData],
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Update User By ID (Gym Owner)
export const updateUserById = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;
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
      active,
    } = req.body;

    const user = await User.findOne({
      where: { id, gymOwnerId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (email !== undefined) user.email = email;
    if (subscriptionType !== undefined)
      user.subscriptionType = subscriptionType;
    if (dateOfJoining !== undefined) user.dateOfJoining = dateOfJoining;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (emergencyPhone !== undefined) user.emergencyPhone = emergencyPhone;
    if (healthInfo !== undefined) user.healthInfo = healthInfo;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (gender !== undefined) user.gender = gender;
    if (active !== undefined) user.active = active;

    // Handle profile image upload to S3
    if (req.file) {
      try {
        const profileImageUrl = await uploadToS3(req.file, "users/profiles");
        if (profileImageUrl) {
          user.profileImage = profileImageUrl;
        } else {
          console.warn(
            "⚠️ Profile image upload returned null, keeping existing image"
          );
        }
      } catch (error) {
        console.error(
          "⚠️ Profile image upload failed, keeping existing image:",
          error.message
        );
      }
    }

    await user.save();

    const userData = user.toJSON();
    delete userData.otp;
    delete userData.token;

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Update user by ID error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Remove User By ID (Gym Owner)
export const removeUserById = async (req, res) => {
  try {
    const gymOwnerId = req.gymOwner.id;
    const { id } = req.params;

    const user = await User.findOne({
      where: { id, gymOwnerId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User removed successfully",
      data: null,
    });
  } catch (error) {
    console.error("Remove user by ID error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Password-based Login (NEW)
export const loginUserWithPassword = async (req, res) => {
  try {
    const { uniqueId, email, password, deviceToken } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
        data: null,
      });
    }

    if (!uniqueId && !email) {
      return res.status(400).json({
        success: false,
        message: "Unique ID or email is required",
        data: null,
      });
    }

    // Find user by unique ID or email
    let user;
    if (uniqueId) {
      user = await User.findOne({ where: { uniqueId } });
    } else if (email) {
      user = await User.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    // Check if password exists
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Password not set. Please set your password first.",
        data: null,
      });
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid unique ID or password",
        data: null,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, phone: user.phone, gymOwnerId: user.gymOwnerId, role: "user" },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    // Update user token and device token
    await user.update({
      token,
      status: true,
      deviceToken: deviceToken || user.deviceToken,
    });

    // Return user data without sensitive fields
    const userData = user.toJSON();
    delete userData.password;
    delete userData.otp;
    delete userData.otpTimestamp;
    delete userData.passwordResetToken;
    delete userData.passwordResetExpires;
    userData.token = token;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    console.error("Login user with password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Set Password (First Time Login with Token Verification)
export const setPassword = async (req, res) => {
  try {
    const { uniqueId, email, token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Token, password, and confirm password are required",
        data: null,
      });
    }

    if (!uniqueId && !email) {
      return res.status(400).json({
        success: false,
        message: "Unique ID or email is required",
        data: null,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
        data: null,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
        data: null,
      });
    }

    // Find user by unique ID or email
    let user;
    if (uniqueId) {
      user = await User.findOne({ where: { uniqueId } });
    } else if (email) {
      user = await User.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Verify password reset token
    if (!user.passwordResetToken || user.passwordResetToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired password setup token",
        data: null,
      });
    }

    // Check if token has expired
    if (user.passwordResetExpires < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Password setup token has expired. Please request a new invitation.",
        data: null,
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user password and clear token
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return res.status(200).json({
      success: true,
      message: "Password set successfully. You can now log in.",
      data: null,
    });
  } catch (error) {
    console.error("Set password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Forgot Password - Send Temporary Password
export const forgotPassword = async (req, res) => {
  try {
    const { email, uniqueId } = req.body;

    if (!email && !uniqueId) {
      return res.status(400).json({
        success: false,
        message: "Email or Unique ID is required",
        data: null,
      });
    }

    // Find user by email or uniqueId
    let user;
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (uniqueId) {
      user = await User.findOne({ where: { uniqueId } });
    }

    if (!user) {
      // Don't reveal if email/uniqueId exists for security
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email or unique ID, a temporary password has been sent",
        data: null,
      });
    }

    // Generate temporary password (3 characters + @ + 3 numbers)
    const generateTempPassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';

      let password = '';
      for (let i = 0; i < 3; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      password += '@';
      for (let i = 0; i < 3; i++) {
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      return password;
    };

    const tempPassword = generateTempPassword();
    console.log("🔐 Generated temporary password for forgot password");

    // Hash the temporary password
    const hashedPassword = await bcryptjs.hash(tempPassword, 10);

    // Update user with new password and set isNewUser to false
    await user.update({
      password: hashedPassword,
      isNewUser: false,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    // Send temporary password email
    try {
      const userName = `${user.firstName} ${user.lastName}`;
      await sendForgotPasswordEmail(user.email, userName, user.uniqueId, tempPassword);
      console.log("✅ Temporary password email sent to:", user.email);
    } catch (emailError) {
      console.error("⚠️ Failed to send temporary password email:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists with this email or unique ID, a temporary password has been sent",
      data: null,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Reset Password - Using Token from Email
export const resetPassword = async (req, res) => {
  try {
    const { email, token, password, confirmPassword } = req.body;

    if (!email || !token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, token, password, and confirm password are required",
        data: null,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
        data: null,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
        data: null,
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Verify token
    if (!user.passwordResetToken || user.passwordResetToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired password reset token",
        data: null,
      });
    }

    // Check expiry
    if (user.passwordResetExpires < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Password reset token has expired. Please request a new one.",
        data: null,
      });
    }

    // Hash and update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
      data: null,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

// Change Password - Authenticated User
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password, new password, and confirm password are required",
        data: null,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
        data: null,
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
        data: null,
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Verify old password
    const isOldPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
        data: null,
      });
    }

    // Hash and update new password, set isNewUser to false
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
      isNewUser: false
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};
