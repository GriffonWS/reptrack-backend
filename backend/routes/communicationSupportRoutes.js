import express from "express";
import { communicationSupportController } from "../controllers/communicationSupportController.js";

const router = express.Router();

router.get(
  "/get-all",
  communicationSupportController.getAllCommunicationSupport
);
router.post(
  "/create",
  communicationSupportController.createCommunicationSupport
);
router.get(
  "/get-by-sender_id",
  communicationSupportController.getCommunicationByUniqueId
);

export default router;
