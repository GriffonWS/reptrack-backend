import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminByToken,
  updateAdminByToken,
  logoutAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register-admin", registerAdmin);
router.post("/login-admin", loginAdmin);
router.get("/get-admin", getAdminByToken);
router.put("/update-admin", updateAdminByToken);
router.post("/logout-admin", logoutAdmin);
export default router;
