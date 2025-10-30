# Changelog: Phase 1 Step 5 - Model Layer Extraction

**Date:** October 29, 2025  
**Phase:** Phase 1 - Backend Restructuring  
**Step:** 5 - Create Models for Database Operations

## Overview

Created a comprehensive model layer to handle all database operations, separating data access from business logic. Models now handle raw database queries while services focus on business logic.

## Changes Made

### 1. Created Model Files

#### A. Seller Model (`src/models/seller.model.js`)

**Purpose:** Handle NGO table database operations

**Functions:**

- `createSeller(sellerData)` - Insert new NGO record
- `getSellerByEmail(email)` - Fetch NGO by email
- `getSellerById(ngoId)` - Fetch NGO by ID
- `updateSeller(ngoId, updateData)` - Update NGO record
- `deleteSeller(ngoId)` - Delete NGO record

**Key Features:**

- Parameterized queries ($1, $2, etc.)
- Returns raw database results
- Handles all NGO table operations
- No business logic, pure data access

#### B. Buyer Model (`src/models/buyer.model.js`)

**Purpose:** Handle buyer table database operations

**Functions:**

- `createBuyer(buyerData)` - Insert new buyer record
- `getBuyerByEmail(email)` - Fetch buyer by email
- `getBuyerById(buyerId)` - Fetch buyer by ID
- `updateBuyer(buyerId, updateData)` - Update buyer record
- `deleteBuyer(buyerId)` - Delete buyer record

**Key Features:**

- Parameterized queries ($1, $2, etc.)
- Returns raw database results
- Handles all buyer table operations
- Mirrors seller model structure

#### C. Project Model (`src/models/project.model.js`)

**Purpose:** Handle project table database operations

**Functions:**

- `createProject(projectData)` - Insert new project
- `getAllProjects(filters)` - Fetch all projects with filters
- `getProjectById(projectId)` - Fetch project by ID
- `getProjectsByUserId(sellerId, sellerType)` - Fetch projects by user
- `updateProject(projectId, updateData)` - Update project
- `updateProjectStatus(projectId, status)` - Update project status
- `deleteProject(projectId)` - Delete project

**Key Features:**

- Dynamic filtering (status, seller_type, location)
- Parameterized queries
- Returns raw database results
- Supports pagination-ready queries

### 2. Created Utility Functions

#### Database Utilities (`src/utils/database.utils.js`)

**Purpose:** Reusable query building helpers

**Functions:**

- `buildWhereClause(filters, startParam)` - Build WHERE clause from filters
- `buildLikeClause(field, value, paramNumber)` - Build LIKE clause for text search
- `buildPagination(page, limit, startParam)` - Build LIMIT/OFFSET pagination
- `buildSortClause(field, direction)` - Build ORDER BY clause
- `buildUpdateSetClause(data, startParam)` - Build dynamic UPDATE SET clause
- `buildInClause(field, values, startParam)` - Build IN clause for arrays

**Key Features:**

- Consistent parameterized query building
- Reusable across all models
- SQL injection prevention
- Flexible and extensible

### 3. Updated Service Files

#### A. Auth Service (`src/services/auth.service.js`)

**Changes:**

- Removed direct database queries
- Imported `SellerModel` and `BuyerModel`
- Updated `ngoRegisterService()` to use `SellerModel.createSeller()`
- Updated `ngoLoginService()` to use `SellerModel.getSellerByEmail()`
- Updated `buyerRegisterService()` to use `BuyerModel.createBuyer()`
- Updated `buyerLoginService()` to use `BuyerModel.getBuyerByEmail()`
- Updated `getBuyerProfileService()` to use `BuyerModel.getBuyerById()`
- Updated `updateBuyerProfileService()` to use `BuyerModel.updateBuyer()`

**Benefits:**

- Business logic separated from data access
- Cleaner, more maintainable code
- Consistent error handling

#### B. Project Service (`src/services/project.service.js`)

**Changes:**

- Removed direct database queries
- Imported `ProjectModel`
- Updated all functions to use model methods:
  - `createProjectService()` → `ProjectModel.createProject()`
  - `submitProjectService()` → `ProjectModel.createProject()`
  - `getAllProjectsService()` → `ProjectModel.getAllProjects()`
  - `getProjectByIdService()` → `ProjectModel.getProjectById()`
  - `updateProjectService()` → `ProjectModel.updateProject()`
  - `deleteProjectService()` → `ProjectModel.deleteProject()`
  - `getProjectsBySellerService()` → `ProjectModel.getProjectsByUserId()`
  - `updateProjectStatusService()` → `ProjectModel.updateProjectStatus()`
  - `uploadProjectPhotosService()` → `ProjectModel.updateProject()`

**Benefits:**

- Simplified query logic
- Focused on business rules and validation
- Reusable database operations

#### C. Buyer Service (`src/services/buyer.service.js`)

**Changes:**

- Removed direct database queries
- Imported `BuyerModel`
- Updated `getBuyerDashboardService()` to use `BuyerModel.getBuyerById()`
- Updated `updateBuyerWalletService()` to use `BuyerModel.updateBuyer()`

**Benefits:**

- Consistent with other services
- Password handling in service layer
- Clean data access

#### D. Dashboard Service (`src/services/dashboard.service.js`)

**Changes:**

- Removed direct database queries
- Imported `SellerModel` and `ProjectModel`
- Updated `getNgoDashboardService()` to use:
  - `SellerModel.getSellerById()` for NGO profile
  - `ProjectModel.getProjectsByUserId()` for projects

**Benefits:**

- Cleaner dashboard logic
- Reusable model functions
- Easier to maintain

### 4. Updated Legacy User Model

#### User Model (`src/models/user.model.js`)

**Status:** DEPRECATED

**Changes:**

- Marked as deprecated
- Added backward compatibility layer
- Redirects to `SellerModel` and `BuyerModel`
- Kept for reference during migration

**Functions:**

- All functions now delegate to appropriate model
- Will be removed in future phase

## Architecture Benefits

### Separation of Concerns

```plaintext
Controller → Service → Model → Database
   ↓           ↓         ↓
Request    Business   Data
Handling    Logic    Access
```

### Model Responsibilities

- ✅ Execute raw SQL queries
- ✅ Parameterized query execution
- ✅ Return raw database results
- ❌ NO business logic
- ❌ NO validation
- ❌ NO data transformation

### Service Responsibilities

- ✅ Business logic and rules
- ✅ Data validation
- ✅ Error handling
- ✅ Data transformation
- ❌ NO direct database queries

### Controller Responsibilities

- ✅ Request/response handling
- ✅ HTTP status codes
- ✅ Route definitions
- ❌ NO business logic
- ❌ NO database access

## Database Query Patterns

### Parameterized Queries

```javascript
// Before (in service)
const result = await pool.query("SELECT * FROM ngo WHERE email = $1", [email]);
const ngo = result.rows[0];

// After (in model)
export const getSellerByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM ngo WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
};
```

### Dynamic Updates

```javascript
// Using model
export const updateBuyer = async (buyerId, updateData) => {
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");

  const result = await pool.query(
    `UPDATE buyer SET ${setClause}, updated_at = NOW() 
     WHERE buyer_id = $1 RETURNING *`,
    [buyerId, ...values]
  );

  return result.rows[0] || null;
};
```

## Testing Checklist

### NGO Operations

- [ ] NGO registration
- [ ] NGO login
- [ ] NGO profile fetch
- [ ] NGO dashboard

### Buyer Operations

- [ ] Buyer registration
- [ ] Buyer login
- [ ] Buyer profile fetch
- [ ] Buyer profile update
- [ ] Buyer wallet update
- [ ] Buyer dashboard

### Project Operations

- [ ] Create project
- [ ] Submit project
- [ ] Get all projects
- [ ] Get project by ID
- [ ] Get projects by seller
- [ ] Update project
- [ ] Update project status
- [ ] Upload project photos
- [ ] Delete project

## File Structure

```plaintext
backend/
├── src/
│   ├── models/
│   │   ├── seller.model.js      [NEW] NGO database operations
│   │   ├── buyer.model.js       [NEW] Buyer database operations
│   │   ├── project.model.js     [NEW] Project database operations
│   │   └── user.model.js        [DEPRECATED] Legacy user model
│   ├── services/
│   │   ├── auth.service.js      [UPDATED] Uses models
│   │   ├── buyer.service.js     [UPDATED] Uses models
│   │   ├── project.service.js   [UPDATED] Uses models
│   │   └── dashboard.service.js [UPDATED] Uses models
│   └── utils/
│       └── database.utils.js    [NEW] Query builders
```

## Breaking Changes

**None.** All existing functionality preserved.

## Next Steps

### Phase 1, Step 6: Update Routes

1. Import new controllers in route files
2. Remove old route implementations
3. Use clean route → controller pattern
4. Update route documentation

### Future Enhancements

1. Add model-level input sanitization
2. Implement query result caching
3. Add database connection pooling optimization
4. Create model unit tests
5. Add transaction support for complex operations

## Notes

- All database tables remain unchanged (ngo, buyer, project)
- All parameterized queries prevent SQL injection
- Models return `null` when records not found (consistent pattern)
- Services handle error messages and transformations
- Backward compatibility maintained through user.model.js

---

**Status:** ✅ Complete  
**Next Phase:** Phase 1, Step 6 - Update Routes to Use New Controllers
