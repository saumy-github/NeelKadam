# Middleware Documentation

## Structure

```plain
backend/src/middleware/
├── index.js
├── auth.middleware.js
├── error.middleware.js
└── validation.middleware.js
```

## Available Middleware

### Authentication & Authorization

**authMiddleware** - Verify JWT token and attach user to request

**optionalAuth** - Optional authentication, continues without token

**requireRole(roles)** - Check if user has required role

**requireSeller** - Require seller/NGO role

**requireBuyer** - Require buyer role

**requireAdmin** - Require admin role

### Error Handling

**errorHandler** - Global error handler for all routes

**notFoundHandler** - Handle 404 errors

**asyncHandler** - Wrap async functions to catch errors

### Validation

**validateRequiredFields(fields)** - Check required fields exist

**validateEmail(field)** - Validate email format

**validateNumber(field, min, max)** - Validate number with range

**validateUUID(param)** - Validate UUID parameter

**validateIntegerId(param)** - Validate integer ID parameter

## Usage Examples

### Import from index

```javascript
import { authMiddleware, validateEmail } from "../middleware/index.js";
```

### Protected route

```javascript
router.get("/dashboard", authMiddleware, controller);
```

### Role-based access

```javascript
router.post("/submit", authMiddleware, requireSeller, controller);
```

### Input validation

```javascript
router.post(
  "/register",
  validateRequiredFields(["email", "password"]),
  validateEmail("email"),
  controller
);
```

### Async error handling

```javascript
router.get(
  "/data",
  asyncHandler(async (req, res) => {
    const data = await service.getData();
    res.json(data);
  })
);
```

## Notes

All middleware files use concise inline comments with // style.

All exports are available through the central index.js file.

Backward compatible with existing authentication flows.
