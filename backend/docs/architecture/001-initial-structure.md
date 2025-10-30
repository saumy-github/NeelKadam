# 001 - Initial MVC Structure & Organization

> **Document Type:** Architecture Documentation  
> **Phase:** Phase 1, Step 1  
> **Date Created:** October 28, 2025  
> **Status:** ✅ Completed  
> **Related Changelog:** [001-phase1-restructure.md](../changelog/001-phase1-restructure.md)

---

## Purpose

This document describes the initial refactoring of the backend from a monolithic structure to a proper MVC (Model-View-Controller) architecture with clear separation of concerns.

## Goals Achieved

- ✅ Created organized `src/` directory structure
- ✅ Established naming conventions for all file types
- ✅ Removed community and panchayat functionality (focus on NGO and Buyer)
- ✅ Updated all import paths to new locations
- ✅ Preserved ESM syntax throughout

---

## Current Folder Structure

```plaintext
backend/
│
├── 📁 src/                          ← New organized source code directory
│   ├── 📁 controllers/              ← HTTP request handlers
│   │   ├── auth.controller.js       (Placeholder - Auth operations)
│   │   ├── buyer.controller.js      (Placeholder - Buyer operations)
│   │   ├── dashboard.controller.js  (Placeholder - Dashboard data)
│   │   └── project.controller.js    (Placeholder - Project CRUD)
│   │
│   ├── 📁 services/                 ← Business logic layer
│   │   └── auth.service.js          (Placeholder - Auth business logic)
│   │
│   ├── 📁 models/                   ← Data access layer
│   │   └── user.model.js            (Placeholder - User DB operations)
│   │
│   ├── 📁 routes/                   ← Route definitions (empty - Phase 2)
│   │
│   ├── 📁 middleware/               ← Custom middleware
│   │   └── auth.middleware.js       ✅ Moved from /middleware/
│   │
│   ├── 📁 config/                   ← Configuration files
│   │   └── database.config.js       ✅ Moved from /db.js
│   │
│   ├── 📁 utils/                    ← Non-blockchain utilities (empty)
│   │
│   └── 📁 database/                 ← Database schemas & migrations
│       └── schema.sql               ✅ Moved from /database_schema/
│
├── 📁 routes/                       ← Legacy routes (to be refactored in Phase 2)
│   ├── 📁 auth/
│   │   ├── ngo.js                   ✅ Imports updated
│   │   └── buyer.js                 ✅ Imports updated
│   ├── projects.js                  ✅ Imports updated
│   ├── admin.js                     ✅ Imports updated
│   ├── admin_route.js               ✅ Imports updated
│   ├── dashboard_route.js           ✅ Imports updated
│   └── buyer_route.js               ✅ Imports updated
│
├── 📁 utils/                        ← Blockchain utilities (Phase 4)
│   └── blockchain.js                🔵 Keep for now
│
├── 📁 scripts/                      ← Blockchain scripts (Phase 4)
│   ├── checkProvider.js             🔵 Keep for now
│   ├── checkRole.js                 🔵 Keep for now
│   ├── config.js                    🔵 Keep for now
│   ├── estimateMint.js              🔵 Keep for now
│   ├── findRoleEvents.js            🔵 Keep for now
│   └── grantNCCR.js                 🔵 Keep for now
│
├── 📁 middleware/                   ⚠️ Can be deleted (moved to src/)
├── 📁 database_schema/              ⚠️ Can be deleted (moved to src/)
├── index.js                         ✅ Imports updated (to be split in Phase 1.2)
└── package.json

Legend:
✅ = File moved/updated successfully
🔵 = Blockchain-related (keeping for Phase 4)
⚠️ = Can be cleaned up (old folders)
📁 = Directory
```

---

## MVC Architecture Flow

```plaintext
Request Flow:
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP Request
       ↓
┌─────────────────────────────┐
│      index.js (temp)         │  ← Phase 1.2: Split to app.js + server.js
│  - Express app setup         │
│  - Middleware configuration  │
│  - Route registration        │
└──────────┬──────────────────┘
           │
           ↓
┌─────────────────────────────┐
│    routes/ (legacy)          │  ← Phase 2: Move to src/routes/
│  - Route definitions         │
│  - Currently has mixed logic │
└──────────┬──────────────────┘
           │
           ↓
┌─────────────────────────────┐
│   src/controllers/           │  ← Phase 2: Extract from routes
│  - Handle HTTP req/res       │
│  - Input validation          │
│  - Call services             │
└──────────┬──────────────────┘
           │
           ↓
┌─────────────────────────────┐
│    src/services/             │  ← Phase 2: Extract business logic
│  - Business logic            │
│  - Data transformation       │
│  - Call models               │
└──────────┬──────────────────┘
           │
           ↓
┌─────────────────────────────┐
│     src/models/              │  ← Phase 2: Extract DB queries
│  - Database queries          │
│  - Data access layer         │
│  - Return data               │
└──────────┬──────────────────┘
           │
           ↓
┌─────────────────────────────┐
│  src/config/database.config  │  ← Phase 1: Already moved ✅
│  - PostgreSQL pool           │
│  - Connection management     │
└─────────────────────────────┘
```

---

## Import Path Changes

### Before Refactoring

```javascript
// Routes importing database
import pool from "../db.js"; // ❌ Old
import pool from "../../db.js"; // ❌ Old

// Routes importing auth middleware
import authMiddleware from "../middleware/auth_middleware.js"; // ❌ Old
```

### After Phase 1, Step 1

```javascript
// Routes importing database
import pool from "../src/config/database.config.js"; // ✅ New
import pool from "../../src/config/database.config.js"; // ✅ New

// Routes importing auth middleware
import authMiddleware from "../src/middleware/auth.middleware.js"; // ✅ New
```

---

## Removed Functionality

These files have been deleted as part of focusing on NGO and Buyer functionality:

- ❌ `routes/auth/community.js`
- ❌ `routes/auth/panchayat.js`

Corresponding imports and route registrations removed from `index.js`.

---

## Next Phase Preview

### Phase 1, Step 2: Split index.js

- Create `app.js` (Express configuration)
- Create `server.js` (Server startup)
- Update package.json entry point

### Phase 2: Extract Controllers & Services

- Move logic from `routes/` to `src/controllers/`
- Extract business logic to `src/services/`
- Extract DB queries to `src/models/`
- Create clean route definitions in `src/routes/`

### Phase 3: Additional Refactoring

- Create admin controller and service
- Create project model
- Add error handling middleware
- Add validation middleware

### Phase 4: Blockchain Integration

- Move `utils/blockchain.js` to `src/utils/blockchain.util.js`
- Organize `scripts/` folder
- Create blockchain service layer

---

## Why This Architecture?

### Benefits of MVC Pattern

1. **Separation of Concerns** - Each layer has a specific responsibility
2. **Maintainability** - Easier to locate and fix bugs
3. **Testability** - Each layer can be tested independently
4. **Scalability** - Easy to add new features without touching existing code
5. **Team Collaboration** - Multiple developers can work on different layers

### Naming Conventions

- **Controllers** (`*.controller.js`) - Handle HTTP requests/responses
- **Services** (`*.service.js`) - Business logic and data transformation
- **Models** (`*.model.js`) - Database queries and data access
- **Middleware** (`*.middleware.js`) - Request processing and validation
- **Config** (`*.config.js`) - Configuration and setup

---

**Document Version:** 1.0  
**Last Updated:** October 28, 2025  
**Next Document:** [002-app-server-split.md](002-app-server-split.md) (Phase 1, Step 2)
