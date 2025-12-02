import express from 'express';
import {
  registerUser,
  loginUser,
  verifyOtp,
  updateUser,
  resendOtp,
  logoutUser,
  deleteUser,
  removeUser,
  getUser,
  getAllUsers,
  getUserById,
  updateUserById,
  removeUserById,
  loginUserWithPassword,
  setPassword,
  forgotPassword,
  resetPassword,
  changePassword
} from '../controllers/user.controller.js';
import { verifyGymOwnerToken, verifyUserToken } from '../middleware/auth.middleware.js';
import { upload } from '../config/multer.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// Password-based login routes (NEW)
router.post('/login-password', loginUserWithPassword);
router.post('/set-password', setPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', verifyUserToken, changePassword);

// Protected routes - User
router.post('/register', verifyGymOwnerToken, upload.single('profile_image'), registerUser);
router.put('/update', verifyUserToken, upload.single('profile_image'), updateUser);
router.get('/logout', verifyUserToken, logoutUser);
router.delete('/delete', verifyUserToken, deleteUser);
router.delete('/remove', verifyUserToken, removeUser);
router.get('/getUser', verifyUserToken, getUser);

// Protected routes - Gym Owner (for managing users)
router.get('/all-users', verifyGymOwnerToken, getAllUsers);
router.get('/get-user-details/:id', verifyGymOwnerToken, getUserById);
router.put('/update/:id', verifyGymOwnerToken, upload.single('profile_image'), updateUserById);
router.delete('/remove/:id', verifyGymOwnerToken, removeUserById);

export default router;