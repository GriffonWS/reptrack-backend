import Support from "../models/communicationSupportModels.js";

const communicationSupportController = {
  // Create a new support query (for users)
  createSupport: async (req, res) => {
    try {
      const { query, senderId, email } = req.body;

      if (!query || !senderId || !email) {
        return res.status(400).json({
          success: false,
          message: "Query, senderId, and email are required",
          data: null,
        });
      }

      const newSupport = new Support({ query, senderId, email });
      const savedSupport = await newSupport.save();

      return res.status(201).json({
        success: true,
        message: "Support query created successfully",
        data: savedSupport,
      });
    } catch (error) {
      console.error("Create Support Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  // Get all support queries (for admin)
  getAllSupports: async (req, res) => {
    try {
      const supports = await Support.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        message: "Support queries fetched successfully",
        data: supports,
      });
    } catch (error) {
      console.error("Get All Supports Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },

  // Get support queries by senderId (for admin or user)
  getSupportsBySenderId: async (req, res) => {
    try {
      const { senderId } = req.body;

      if (!senderId) {
        return res.status(400).json({
          success: false,
          message: "Sender ID is required",
          data: null,
        });
      }

      const supports = await Support.find({ senderId }).sort({ createdAt: -1 });

      if (supports.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No queries found for this sender",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Support queries fetched successfully",
        data: supports,
      });
    } catch (error) {
      console.error("Get Supports By SenderId Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  },
};

export default communicationSupportController;
