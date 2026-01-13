import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminByToken,
  updateAdminByToken,
  changePassword,
  logout
} from '../controllers/admin.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/auth/register-admin', registerAdmin);
router.post('/auth/login-admin', loginAdmin);

// Protected routes (authentication required)
router.get('/admin/get', verifyToken, getAdminByToken);
router.put('/admin/update', verifyToken, updateAdminByToken);
router.post('/admin/change-password', verifyToken, changePassword);
router.get('/admin/logout', verifyToken, logout);

export default router;