import express from "express";
const router = express.Router();
import adminController from "../controllers/adminController.js";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and authentication
 */

/**
 * @swagger
 * /auth/register-admin:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request (missing fields or admin already exists)
 *       500:
 *         description: Internal server error
 */
router.post("/auth/register-admin", adminController.registerAdmin);

/**
 * @swagger
 * /auth/login-admin:
 *   post:
 *     summary: Login admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post("/auth/login-admin", adminController.loginAdmin);

/**
 * @swagger
 * /auth/get-admin:
 *   post:
 *     summary: Get admin details by email
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Admin fetched successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
router.post("/auth/get-admin", adminController.getAdminByEmail);

/**
 * @swagger
 * /auth/update-admin:
 *   put:
 *     summary: Update admin details
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
router.put("/auth/update-admin", adminController.updateAdmin);

/**
 * @swagger
 * /auth/logout-admin:
 *   post:
 *     summary: Logout admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Logout successful
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
router.post("/auth/logout-admin", adminController.logoutAdmin);

export default router;
