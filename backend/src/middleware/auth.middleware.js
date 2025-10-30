// Authentication middleware for JWT token verification
import jwt from "jsonwebtoken";

// Verify JWT token and attach user to request
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided.",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token has expired. Please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Authentication failed.",
    });
  }
};

// Optional auth - continues without token
export const optionalAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    console.log("Optional auth: Invalid token, continuing without user");
  }

  next();
};

// Check if user has required role(s)
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
    }

    const userRole = req.user.userType || req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Insufficient permissions.",
        required: allowedRoles,
        current: userRole,
      });
    }

    next();
  };
};

// Require seller/NGO role
export const requireSeller = requireRole(["ngo"]);

// Require buyer role
export const requireBuyer = requireRole(["buyer"]);

// Require admin role
export const requireAdmin = requireRole(["admin"]);

export default authMiddleware;
