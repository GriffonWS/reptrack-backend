import PrivacyPolicy from "../models/privacyPolicy.model.js";

// ✅ Create Privacy Policy
export const createPrivacyPolicy = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
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
};

// ✅ Update Privacy Policy by ID
export const updatePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const policy = await PrivacyPolicy.findByPk(id);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Privacy policy not found",
      });
    }

    policy.content = content || policy.content;
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
};

// ✅ Get All Privacy Policies
export const getPrivacyPolicies = async (req, res) => {
  try {
    const policies = await PrivacyPolicy.findAll({
      order: [["timestamp", "DESC"]],
    });
    res.status(200).json({
      success: true,
      message: "Privacy policies fetched successfully",
      data: policies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch privacy policies",
      error: error.message,
    });
  }
};

// ✅ Get Privacy Policy by ID
export const getPrivacyPolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await PrivacyPolicy.findByPk(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Privacy policy not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Privacy policy fetched successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch privacy policy",
      error: error.message,
    });
  }
};

// ✅ Delete Privacy Policy
export const deletePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await PrivacyPolicy.findByPk(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Privacy policy not found",
      });
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
};
