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
  removeUserById
} from '../controllers/user.controller.js';
import { verifyGymOwnerToken, verifyToken } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// Protected routes - User  
router.post('/register', verifyToken, upload.single('profileImage'), registerUser);
router.put('/update', verifyToken, upload.single('profileImage'), updateUser);
router.get('/logout', verifyToken, logoutUser);
router.delete('/delete', verifyToken, deleteUser);
router.delete('/remove', verifyToken, removeUser);
router.get('/getUser', verifyToken, getUser);

// Protected routes - Gym Owner (for managing users)
router.get('/all-users', verifyGymOwnerToken, getAllUsers);
router.get('/get-user-details/:id', verifyGymOwnerToken, getUserById);
router.put('/update/:id', verifyGymOwnerToken, upload.single('profileImage'), updateUserById);
router.delete('/remove/:id', verifyGymOwnerToken, removeUserById);

export default router;