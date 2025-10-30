# Model Layer Quick Reference Guide

## Overview

The model layer handles all database operations. Models return raw database results and should NOT contain business logic.

## Import Patterns

```javascript
// In service files
import * as SellerModel from "../models/seller.model.js";
import * as BuyerModel from "../models/buyer.model.js";
import * as ProjectModel from "../models/project.model.js";
```

## Seller Model (NGO) - `seller.model.js`

### Create Seller

```javascript
const newNgo = await SellerModel.createSeller({
  license_no: "LIC123",
  ngo_name: "Green Earth NGO",
  email: "contact@greenearth.org",
  password: hashedPassword,
  spokesperson_name: "John Doe",
  pan_no: "ABCDE1234F",
  account_holder_name: "Green Earth Foundation",
  account_number: "1234567890",
  ifsc_code: "SBIN0001234",
  wallet_address: "0x123...",
});
// Returns: NGO object with ngo_id
```

### Get Seller by Email

```javascript
const ngo = await SellerModel.getSellerByEmail("contact@greenearth.org");
// Returns: NGO object or null
```

### Get Seller by ID

```javascript
const ngo = await SellerModel.getSellerById(1);
// Returns: NGO object or null
```

### Update Seller

```javascript
const updated = await SellerModel.updateSeller(1, {
  spokesperson_name: "Jane Doe",
  phone: "+1234567890",
});
// Returns: Updated NGO object or null
```

### Delete Seller

```javascript
const deleted = await SellerModel.deleteSeller(1);
// Returns: Deleted NGO object or null
```

## Buyer Model - `buyer.model.js`

### Create Buyer

```javascript
const newBuyer = await BuyerModel.createBuyer({
  company_name: "Tech Corp",
  email: "buyer@techcorp.com",
  password: hashedPassword,
  pan_no: "ABCDE1234F",
  account_holder_name: "Tech Corporation",
  account_number: "9876543210",
  ifsc_code: "HDFC0001234",
  wallet_address: "0x456...",
});
// Returns: Buyer object with buyer_id
```

### Get Buyer by Email

```javascript
const buyer = await BuyerModel.getBuyerByEmail("buyer@techcorp.com");
// Returns: Buyer object or null
```

### Get Buyer by ID

```javascript
const buyer = await BuyerModel.getBuyerById(1);
// Returns: Buyer object or null
```

### Update Buyer

```javascript
const updated = await BuyerModel.updateBuyer(1, {
  wallet_address: "0x789...",
  company_name: "Tech Corporation Ltd",
});
// Returns: Updated buyer object or null
```

### Delete Buyer

```javascript
const deleted = await BuyerModel.deleteBuyer(1);
// Returns: Deleted buyer object or null
```

## Project Model - `project.model.js`

### Create Project

```javascript
const newProject = await ProjectModel.createProject({
  seller_id: 1,
  seller_type: "ngo",
  plantation_area: "100 hectares",
  location: "Maharashtra, India",
  tree_type: "Mangrove",
  tree_no: 5000,
  plantation_period: "2025-2027",
  estimated_cc: 1000,
  status: "pending",
});
// Returns: Project object with project_id
```

### Get All Projects

```javascript
// Without filters
const allProjects = await ProjectModel.getAllProjects();

// With filters
const filteredProjects = await ProjectModel.getAllProjects({
  status: "approved",
  seller_type: "ngo",
  location: "Maharashtra",
});
// Returns: Array of project objects
```

### Get Project by ID

```javascript
const project = await ProjectModel.getProjectById(1);
// Returns: Project object or null
```

### Get Projects by User ID

```javascript
// Without seller type filter
const projects = await ProjectModel.getProjectsByUserId(1);

// With seller type filter
const ngoProjects = await ProjectModel.getProjectsByUserId(1, "ngo");
// Returns: Array of project objects
```

### Update Project

```javascript
const updated = await ProjectModel.updateProject(1, {
  tree_no: 6000,
  estimated_cc: 1200,
  photos: JSON.stringify(["photo1.jpg", "photo2.jpg"]),
});
// Returns: Updated project object or null
```

### Update Project Status

```javascript
const updated = await ProjectModel.updateProjectStatus(1, "approved");
// Returns: Updated project object or null
```

### Delete Project

```javascript
const deleted = await ProjectModel.deleteProject(1);
// Returns: Deleted project object or null
```

## Database Utilities - `database.utils.js`

### Build WHERE Clause

```javascript
import { buildWhereClause } from "../utils/database.utils.js";

const filters = { status: "approved", seller_type: "ngo" };
const { clause, values, nextParam } = buildWhereClause(filters, 1);
// clause: "WHERE status = $1 AND seller_type = $2"
// values: ["approved", "ngo"]
// nextParam: 3
```

### Build LIKE Clause

```javascript
import { buildLikeClause } from "../utils/database.utils.js";

const { clause, value } = buildLikeClause("location", "Maharashtra", 1);
// clause: "location ILIKE $1"
// value: "%Maharashtra%"
```

### Build Pagination

```javascript
import { buildPagination } from "../utils/database.utils.js";

const { clause, values, nextParam } = buildPagination(2, 10, 1);
// clause: "LIMIT $1 OFFSET $2"
// values: [10, 10]  // page 2, limit 10, offset 10
// nextParam: 3
```

### Build Sort Clause

```javascript
import { buildSortClause } from "../utils/database.utils.js";

const clause = buildSortClause("created_at", "DESC");
// clause: "ORDER BY created_at DESC"
```

### Build Update SET Clause

```javascript
import { buildUpdateSetClause } from "../utils/database.utils.js";

const data = { name: "New Name", status: "active" };
const { clause, values, nextParam } = buildUpdateSetClause(data, 2);
// clause: "name = $2, status = $3"
// values: ["New Name", "active"]
// nextParam: 4
// Note: $1 is typically the ID in UPDATE queries
```

### Build IN Clause

```javascript
import { buildInClause } from "../utils/database.utils.js";

const statuses = ["pending", "approved", "completed"];
const { clause, values, nextParam } = buildInClause("status", statuses, 1);
// clause: "status IN ($1, $2, $3)"
// values: ["pending", "approved", "completed"]
// nextParam: 4
```

## Best Practices

### ✅ DO

1. **Use Models in Services**

   ```javascript
   // In service file
   const ngo = await SellerModel.getSellerByEmail(email);
   if (!ngo) {
     throw new Error("NGO not found");
   }
   ```

2. **Handle Null Returns**

   ```javascript
   const project = await ProjectModel.getProjectById(id);
   if (!project) {
     throw new Error("Project not found");
   }
   ```

3. **Use Parameterized Queries**

   ```javascript
   // Always use $1, $2, etc.
   const result = await pool.query("SELECT * FROM ngo WHERE email = $1", [
     email,
   ]);
   ```

4. **Return Raw Database Results**

   ```javascript
   // In model
   return result.rows[0] || null;
   ```

### ❌ DON'T

1. **Don't Add Business Logic in Models**

   ```javascript
   // BAD - validation in model
   export const createSeller = async (data) => {
     if (!data.email) {
       throw new Error("Email required");
     }
     // ...
   };

   // GOOD - validation in service
   export const createSellerService = async (data) => {
     if (!data.email) {
       throw new Error("Email required");
     }
     return await SellerModel.createSeller(data);
   };
   ```

2. **Don't Transform Data in Models**

   ```javascript
   // BAD - transformation in model
   export const getSellerById = async (id) => {
     const result = await pool.query(...);
     const ngo = result.rows[0];
     delete ngo.password; // Transformation!
     return ngo;
   };

   // GOOD - transformation in service
   export const getSellerService = async (id) => {
     const ngo = await SellerModel.getSellerById(id);
     const { password, ...safeNgo } = ngo;
     return safeNgo;
   };
   ```

3. **Don't Use String Concatenation for Queries**

   ```javascript
   // BAD - SQL injection risk
   const query = `SELECT * FROM ngo WHERE email = '${email}'`;

   // GOOD - parameterized query
   const query = "SELECT * FROM ngo WHERE email = $1";
   const values = [email];
   ```

## Common Patterns

### Authentication Flow

```javascript
// Service layer
export const loginService = async (email, password) => {
  // 1. Get user from model
  const user = await SellerModel.getSellerByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // 2. Business logic (password check)
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // 3. Generate token
  const token = jwt.sign({ user_id: user.ngo_id }, SECRET);

  // 4. Return response
  return { token, user };
};
```

### CRUD Operations

```javascript
// Create
const created = await Model.create(data);

// Read
const item = await Model.getById(id);
const items = await Model.getAll(filters);

// Update
const updated = await Model.update(id, data);

// Delete
const deleted = await Model.delete(id);
```

### Error Handling

```javascript
// In service
try {
  const result = await Model.create(data);
  return { success: true, data: result };
} catch (error) {
  if (error.code === "23505") {
    throw new Error("Email already exists");
  }
  throw error;
}
```

## Model Return Values

All models follow consistent patterns:

- **Single record queries**: Return object or `null`
- **Multiple record queries**: Return array (empty array if no results)
- **Create operations**: Return created object
- **Update operations**: Return updated object or `null`
- **Delete operations**: Return deleted object or `null`

---

**Reference:** Phase 1, Step 5 - Model Layer Extraction  
**Last Updated:** October 29, 2025
