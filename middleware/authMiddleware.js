// middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // Check if Authorization header starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format. Use: Bearer <token>",
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    // Attach token to request object for use in controllers
    req.token = token;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed: " + error.message,
    });
  }
};

export default authMiddleware;
