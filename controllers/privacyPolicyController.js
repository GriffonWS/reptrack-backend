import { PrivacyPolicy } from "../models/privacyPolicyModel.js";

export const privacyPolicyController = {
  // 🟢 Create a new privacy policy
  createPrivacyPolicy: async (req, res) => {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const policy = await PrivacyPolicy.create({ content });
      res.status(201).json({
        success: true,
        message: "Privacy policy created successfully",
        data: policy,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create privacy policy",
        error: error.message,
      });
    }
  },

  // 🟡 Get all privacy policies
  getAllPrivacyPolicies: async (req, res) => {
    try {
      const policies = await PrivacyPolicy.findAll({
        order: [["id", "DESC"]],
      });
      res.status(200).json({
        success: true,
        message: "Privacy policies retrieved successfully",
        data: policies,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch privacy policies",
        error: error.message,
      });
    }
  },

  // 🟣 Get single policy by ID
  getPrivacyPolicyById: async (req, res) => {
    try {
      const { id } = req.params;
      const policy = await PrivacyPolicy.findByPk(id);

      if (!policy) {
        return res.status(404).json({ message: "Privacy policy not found" });
      }

      res.status(200).json({
        success: true,
        message: "Privacy policy retrieved successfully",
        data: policy,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch privacy policy",
        error: error.message,
      });
    }
  },

  // 🔵 Update policy by ID
  updatePrivacyPolicy: async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const policy = await PrivacyPolicy.findByPk(id);
      if (!policy) {
        return res.status(404).json({ message: "Privacy policy not found" });
      }

      policy.content = content || policy.content;
      policy.timestamp = new Date();

      await policy.save();

      res.status(200).json({
        success: true,
        message: "Privacy policy updated successfully",
        data: policy,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update privacy policy",
        error: error.message,
      });
    }
  },

  // 🔴 Delete policy by ID
  deletePrivacyPolicy: async (req, res) => {
    try {
      const { id } = req.params;
      const policy = await PrivacyPolicy.findByPk(id);

      if (!policy) {
        return res.status(404).json({ message: "Privacy policy not found" });
      }

      await policy.destroy();

      res.status(200).json({
        success: true,
        message: "Privacy policy deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete privacy policy",
        error: error.message,
      });
    }
  },
};
