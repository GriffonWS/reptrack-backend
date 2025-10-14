// routes/userRoutes.js
import express from "express";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/get-all", getAllUsers);

export default router;
