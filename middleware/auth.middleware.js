import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid Authorization header",
        data: null,
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token data to request
    req.admin = decoded;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        data: null,
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        data: null,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Token verification failed",
      data: null,
    });
  }
};

// Verify Admin Token
export const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid Authorization header",
        data: null,
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the role is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
        data: null,
      });
    }

    // Attach decoded token data to request
    req.admin = decoded;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        data: null,
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        data: null,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Token verification failed",
      data: null,
    });
  }
};

// Verify Gym Owner Token
export const verifyGymOwnerToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid Authorization header",
        data: null,
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the role is gym_owner
    if (decoded.role !== "gym_owner") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Gym owner privileges required.",
        data: null,
      });
    }

    // Attach decoded token data to request
    req.gymOwner = decoded;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        data: null,
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        data: null,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Token verification failed",
      data: null,
    });
  }
};

// Verify User Token
export const verifyUserToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid Authorization header",
        data: null,
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 Debug: Console log the decoded token
    console.log("🔐 Token decoded in middleware:");
    console.log("   Full decoded object:", decoded);
    console.log("   Keys available:", Object.keys(decoded));
    console.log("   id:", decoded.id);
    console.log("   gymOwnerId:", decoded.gymOwnerId);
    console.log("   role:", decoded.role);

    // Check if the role is user
    if (decoded.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. User authentication required.",
        data: null,
      });
    }

    // Attach decoded token data to request
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        data: null,
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
        data: null,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Token verification failed",
      data: null,
    });
  }
};
