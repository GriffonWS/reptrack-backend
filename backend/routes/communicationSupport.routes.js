import express from "express";
import {
  getAllCommunicationSupports,
  createCommunicationSupport,
  getCommunicationSupportsBySenderId,
} from "../controllers/communicationSupport.controller.js";

const router = express.Router();

router.get("/get", getAllCommunicationSupports);
router.post("/create", createCommunicationSupport);
router.get("/getBySenderId/:sender_id", getCommunicationSupportsBySenderId);

export default router;
