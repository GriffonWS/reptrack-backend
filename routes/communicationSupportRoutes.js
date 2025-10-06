import express from "express";
import communicationSupportController from "../controllers/communicationSupportController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CommunicationSupport
 *   description: API for user queries and admin support management
 */

/**
 * @swagger
 * /communicationsupports/create:
 *   post:
 *     summary: Create a new support query
 *     description: Allows a user to create a support query (save in DB).
 *     tags: [CommunicationSupport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *               - senderId
 *               - email
 *             properties:
 *               query:
 *                 type: string
 *                 example: "I need help resetting my password"
 *               senderId:
 *                 type: string
 *                 example: "user123"
 *               email:
 *                 type: string
 *                 example: "user123@gmail.com"
 *     responses:
 *       201:
 *         description: Support query created successfully
 *       400:
 *         description: Invalid request
 */
router.post("/create", communicationSupportController.createSupport);

/**
 * @swagger
 * /communicationsupports/get:
 *   get:
 *     summary: Get all support queries
 *     description: Admin can view all queries from users.
 *     tags: [CommunicationSupport]
 *     responses:
 *       200:
 *         description: List of support queries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   query:
 *                     type: string
 *                   senderId:
 *                     type: string
 *                   email:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/get", communicationSupportController.getAllSupports);

/**
 * @swagger
 * /communicationsupports/getBySenderId:
 *   get:
 *     summary: Get support queries by senderId
 *     description: Returns queries of a specific user (by senderId).
 *     tags: [CommunicationSupport]
 *     parameters:
 *       - in: query
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sender/user
 *     responses:
 *       200:
 *         description: List of queries for the given senderId
 *       404:
 *         description: No queries found for this senderId
 */
router.get(
  "/getBySenderId",
  communicationSupportController.getSupportsBySenderId
);

export default router;
