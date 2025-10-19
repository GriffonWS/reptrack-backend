import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  registerUser, // ✅ Import here
} from "../controllers/userController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.use(authenticateAdmin);

// 🆕 Register User
router.post("/register", upload.single("profileImage"), registerUser);

// 📥 Get All Users
router.get("/get-all", getAllUsers);

// 📥 Get User By ID
router.get("/get/:id", getUserById);

// ✏️ Update User
router.put("/update/:id", upload.single("profileImage"), updateUserById);

// 🗑️ Delete User
router.delete("/delete/:id", deleteUserById);

export default router;
