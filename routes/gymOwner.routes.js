import express from 'express';
import {
  registerGymOwner,
  getAllGymOwners,
  getGymOwnerById,
  loginGymOwner,
  getGymOwnerByToken,
  updateGymOwner,
  updateGymOwnerById,
  deleteGymOwner,
  deleteGymOwnerByToken,
  changePassword,
  logout
} from '../controllers/gymOwner.controller.js';
import { verifyAdminToken } from '../middleware/auth.middleware.js';
import { verifyGymOwnerToken } from '../middleware/auth.middleware.js';
import { upload } from '../config/multer.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/login', loginGymOwner);

// Admin-only routes (Protected with admin verification)
router.post('/register', verifyAdminToken, upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'gym_logo', maxCount: 1 }
]), registerGymOwner);
router.get('/get/all', verifyAdminToken, getAllGymOwners);
router.get('/get-by/:id', verifyAdminToken, getGymOwnerById);
router.put('/update/:id', verifyAdminToken, upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'gym_logo', maxCount: 1 }
]), updateGymOwnerById);
router.delete('/delete/:id', verifyAdminToken, deleteGymOwner);

// GymOwner routes (Protected with gym owner verification)
router.get('/by-token', verifyGymOwnerToken, getGymOwnerByToken);
router.put('/update', verifyGymOwnerToken, upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'gym_logo', maxCount: 1 }
]), updateGymOwner);
router.delete('/delete', verifyGymOwnerToken, deleteGymOwnerByToken);
router.post('/change-password', verifyGymOwnerToken, changePassword);
router.post('/logout', verifyGymOwnerToken, logout);

export default router;