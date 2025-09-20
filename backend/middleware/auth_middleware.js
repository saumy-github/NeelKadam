// Authentication middleware for JWT token verification
const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate requests using JWT token
 *
 * This middleware checks for a valid JWT token in the Authorization header,
 * verifies it, and attaches the decoded user information to the request object.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authMiddleware = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;
