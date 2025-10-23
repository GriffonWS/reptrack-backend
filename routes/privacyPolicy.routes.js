import express from "express";
import {
  createPrivacyPolicy,
  updatePrivacyPolicy,
  getPrivacyPolicies,
  getPrivacyPolicyById,
  deletePrivacyPolicy,
} from "../controllers/privacyPolicy.controller.js";

const router = express.Router();

router.post("/create", createPrivacyPolicy);
router.put("/update/:id", updatePrivacyPolicy);
router.get("/all", getPrivacyPolicies);
router.get("/get/:id", getPrivacyPolicyById);
router.delete("/delete/:id", deletePrivacyPolicy);

export default router;
