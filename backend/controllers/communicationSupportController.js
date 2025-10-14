import { CommunicationSupport } from "../models/communicationSupportModels.js";
import { v4 as uuidv4 } from "uuid";

export const communicationSupportController = {
  // 🟢 Get all communication supports
  getAllCommunicationSupport: async (req, res) => {
    try {
      const supports = await CommunicationSupport.findAll({
        order: [["id", "DESC"]],
      });
      res.status(200).json(supports);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch support queries",
        error: error.message,
      });
    }
  },

  // 🟢 Create a new support entry
  createCommunicationSupport: async (req, res) => {
    try {
      const { sender_id, email, query } = req.body;

      // Validate all required fields
      if (!sender_id || !email || !query) {
        return res
          .status(400)
          .json({ message: "sender_id, email and query are required" });
      }

      const newSupport = await CommunicationSupport.create({
        sender_id, // ✅ Now sender_id is defined
        email,
        query,
      });

      res.status(201).json({
        message: "Support query created successfully",
        data: newSupport,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create support query",
        error: error.message,
      });
    }
  },
  // 🟢 Get by unique_id
  getCommunicationByUniqueId: async (req, res) => {
    try {
      const { sender_id } = req.body;
      const support = await CommunicationSupport.findOne({
        where: { sender_id },
      });

      if (!support) {
        return res.status(404).json({ message: "Support query not found" });
      }

      res.status(200).json(support);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch support query",
        error: error.message,
      });
    }
  },
};
