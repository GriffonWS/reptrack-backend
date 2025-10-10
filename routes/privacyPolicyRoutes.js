import express from "express";
import { privacyPolicyController } from "../controllers/privacyPolicyController.js";

const router = express.Router();

// Admin routes (create, update, delete)
router.post("/create", privacyPolicyController.createPrivacyPolicy);
router.put("/update/:id", privacyPolicyController.updatePrivacyPolicy);
router.delete("/delete/:id", privacyPolicyController.deletePrivacyPolicy);

// Public routes (view)
router.get("/get-all", privacyPolicyController.getAllPrivacyPolicies);
router.get("/get/:id", privacyPolicyController.getPrivacyPolicyById);

export default router;
