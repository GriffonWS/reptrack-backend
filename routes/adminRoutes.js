import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  logoutAdmin,
  refreshTokenHandler,
} from "../controllers/adminController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/refresh-token", refreshTokenHandler);

// Protected routes
router.get("/profile", verifyToken, getAdminProfile);
router.put("/profile", verifyToken, updateAdminProfile);
router.post("/logout", verifyToken, logoutAdmin);

// Role-based route example
router.delete(
  "/users/:id",
  verifyToken,
  requireRole("superadmin"),
  (req, res) => {
    res.json({ message: "User deleted" });
  }
);

export default router;