// routes/userRoutes.js
import express from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";

const router = express.Router();

router.get("/get-all", getAllUsers);
router.get("/get/:id", getUserById);

export default router;
