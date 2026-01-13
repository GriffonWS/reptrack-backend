import CommunicationSupport from "../models/communicationSupport.model.js";

// ✅ Get all communication supports
export const getAllCommunicationSupports = async (req, res) => {
  try {
    const data = await CommunicationSupport.findAll();
    res.status(200).json({
      success: true,
      message: "All communication supports fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch communication supports",
      error: error.message,
    });
  }
};

// ✅ Create new communication support
export const createCommunicationSupport = async (req, res) => {
  try {
    const { query, sender_id, email } = req.body;

    if (!query || !sender_id) {
      return res.status(400).json({
        success: false,
        message: "query and sender_id are required",
      });
    }

    const newSupport = await CommunicationSupport.create({
      query,
      sender_id,
      email,
    });

    res.status(201).json({
      success: true,
      message: "Communication support created successfully",
      data: newSupport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create communication support",
      error: error.message,
    });
  }
};

// ✅ Get communication supports by sender_id
export const getCommunicationSupportsBySenderId = async (req, res) => {
  try {
    const { sender_id } = req.params;

    if (!sender_id) {
      return res.status(400).json({
        success: false,
        message: "sender_id is required",
      });
    }

    const data = await CommunicationSupport.findAll({
      where: { sender_id },
    });

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No communication supports found for this sender_id",
      });
    }

    res.status(200).json({
      success: true,
      message: "Communication supports fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch communication supports by sender_id",
      error: error.message,
    });
  }
};
