// Central export point for all middleware functions

// Authentication & Authorization
export {
  default as authMiddleware,
  optionalAuth,
  requireRole,
  requireSeller,
  requireBuyer,
  requireAdmin,
} from "./auth.middleware.js";

// Error Handling
export {
  errorHandler,
  notFoundHandler,
  asyncHandler,
} from "./error.middleware.js";

// Validation
export {
  validateRequiredFields,
  validateEmail,
  validateNumber,
  validateUUID,
  validateIntegerId,
} from "./validation.middleware.js";
