import express from "express";
import equipmentController from "../controllers/equipmentController.js";
import upload from "../config/multer.js"; // Multer setup (local storage)
import uploadToCloudinary from "../middleware/uploadMiddleware.js"; // Uploads file to Cloudinary

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: API for managing gym equipment
 */

/**
 * @swagger
 * /equipments/create:
 *   post:
 *     summary: Create new equipment
 *     description: Add a new equipment with details like name, category, number, and optional image.
 *     tags: [Equipment]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - equipmentName
 *               - equipmentNumber
 *             properties:
 *               equipmentName:
 *                 type: string
 *                 example: Treadmill
 *               category:
 *                 type: string
 *                 example: Cardio
 *               equipmentNumber:
 *                 type: string
 *                 example: EQ-101
 *               equipmentImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Equipment created successfully
 *       400:
 *         description: Invalid request
 */
router.post(
  "/create",
  upload.single("equipmentImage"), // Step 1: Multer saves image locally
  uploadToCloudinary, // Step 2: Upload image to Cloudinary if file exists
  equipmentController.createEquipment // Step 3: Save details in DB
);

/**
 * @swagger
 * /equipments/update/{id}:
 *   put:
 *     summary: Update equipment
 *     description: Update equipment details by ID.
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               equipmentName:
 *                 type: string
 *               category:
 *                 type: string
 *               equipmentNumber:
 *                 type: string
 *               equipmentImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Equipment updated successfully
 *       404:
 *         description: Equipment not found
 */
router.put(
  "/update/:id",
  upload.single("equipmentImage"),
  uploadToCloudinary,
  equipmentController.updateEquipment
);

/**
 * @swagger
 * /equipments/delete/{id}:
 *   delete:
 *     summary: Delete equipment
 *     description: Delete equipment by ID.
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment ID
 *     responses:
 *       200:
 *         description: Equipment deleted successfully
 *       404:
 *         description: Equipment not found
 */
router.delete("/delete/:id", equipmentController.deleteEquipment);

/**
 * @swagger
 * /equipments/get/{id}:
 *   get:
 *     summary: Get equipment by ID
 *     description: Fetch equipment details using its ID.
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment ID
 *     responses:
 *       200:
 *         description: Equipment details
 *       404:
 *         description: Equipment not found
 */
router.get("/get/:id", equipmentController.getEquipmentById);

/**
 * @swagger
 * /equipments/all:
 *   get:
 *     summary: Get all equipment
 *     description: Fetch all equipment records.
 *     tags: [Equipment]
 *     responses:
 *       200:
 *         description: List of all equipment
 */
router.get("/all", equipmentController.getAllEquipment);

/**
 * @swagger
 * /equipments/category:
 *   get:
 *     summary: Get equipment by category
 *     description: Fetch equipment by category.
 *     tags: [Equipment]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment category (e.g., Cardio)
 *     responses:
 *       200:
 *         description: List of equipment in the given category
 *       404:
 *         description: No equipment found for the category
 */
router.get("/category", equipmentController.getEquipmentByCategory);

/**
 * @swagger
 * /equipments/equipmentNumber/{equipmentNumber}:
 *   get:
 *     summary: Get equipment by number
 *     description: Fetch equipment details using equipmentNumber.
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: equipmentNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique equipment number (e.g., EQ-101)
 *     responses:
 *       200:
 *         description: Equipment details
 *       404:
 *         description: Equipment not found
 */
router.get(
  "/equipmentNumber/:equipmentNumber",
  equipmentController.getEquipmentByNumber
);

export default router;
