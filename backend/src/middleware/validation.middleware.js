// Request validation middleware

// Validate required fields exist
export const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        missingFields,
      });
    }

    next();
  };
};

// Validate email format
export const validateEmail = (fieldName = "email") => {
  return (req, res, next) => {
    const email = req.body[fieldName];

    if (!email) {
      return next();
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
        field: fieldName,
      });
    }

    next();
  };
};

// Validate number with optional min/max
export const validateNumber = (fieldName, options = {}) => {
  return (req, res, next) => {
    const value = req.body[fieldName] || req.params[fieldName];

    if (value === undefined) {
      return next();
    }

    const num = Number(value);

    if (isNaN(num)) {
      return res.status(400).json({
        success: false,
        error: `${fieldName} must be a valid number`,
      });
    }

    if (options.integer && !Number.isInteger(num)) {
      return res.status(400).json({
        success: false,
        error: `${fieldName} must be an integer`,
      });
    }

    if (options.min !== undefined && num < options.min) {
      return res.status(400).json({
        success: false,
        error: `${fieldName} must be at least ${options.min}`,
      });
    }

    if (options.max !== undefined && num > options.max) {
      return res.status(400).json({
        success: false,
        error: `${fieldName} must be at most ${options.max}`,
      });
    }

    next();
  };
};

// Validate UUID parameter
export const validateUUID = (paramName = "id") => {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!value) {
      return next();
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      return res.status(400).json({
        success: false,
        error: `Invalid ${paramName} format. Must be a valid UUID.`,
      });
    }

    next();
  };
};

// Validate integer ID parameter
export const validateIntegerId = (paramName = "id") => {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!value) {
      return next();
    }

    const id = parseInt(value, 10);

    if (isNaN(id) || id < 1 || !Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid ${paramName}. Must be a positive integer.`,
      });
    }

    req.params[`${paramName}Parsed`] = id;

    next();
  };
};
