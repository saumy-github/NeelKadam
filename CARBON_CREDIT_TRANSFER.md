# Carbon Credit Transfer Implementation

## Overview

This document describes the implementation of the carbon credit transfer feature that synchronizes blockchain transactions with backend database updates.

## Problem Solved

Previously, when NGOs transferred carbon credits to buyers:

- ✅ Blockchain transaction succeeded
- ✅ Frontend showed success message
- ❌ **Backend logs were silent** (no API calls)
- ❌ **Database balances were NOT updated**

## Solution Architecture

### Flow Diagram

```plaintext
NGO Initiates Transfer
        ↓
Frontend SellCCModal
        ↓
Step 1: Blockchain Transaction (MetaMask)
        ↓
Step 2: Backend API Call (/api/transfer/cc)
        ↓
Backend: Atomic Transaction
   - Verify NGO balance
   - Find buyer by wallet address
   - Reduce NGO total_cc
   - Increase Buyer total_cc
   - Commit or Rollback
        ↓
Success Response to Frontend
```

## Implementation Details

### Backend Components

#### 1. Route (`/backend/src/routes/transfer.js`)

- **Endpoint**: `POST /api/transfer/cc`
- **Authentication**: Protected by JWT middleware
- **Purpose**: Entry point for CC transfer requests

#### 2. Controller (`/backend/src/controllers/transfer.controller.js`)

- **Function**: `transferCarbonCredits`
- **Responsibilities**:
  - Validate request body
  - Extract user info from JWT
  - Call service layer
  - Handle errors with appropriate HTTP codes
  - **Log all operations** (🔵, 🔍, ✅, ❌ emojis)

#### 3. Service (`/backend/src/services/transfer.service.js`)

- **Function**: `transferCarbonCreditsService`
- **Key Features**:
  - Atomic database transaction (BEGIN...COMMIT/ROLLBACK)
  - Validates NGO has sufficient balance
  - Finds buyer by wallet address
  - Updates both NGO and Buyer balances
  - Comprehensive logging at each step

### Database Operations

#### Tables Used (No New Tables Created)

1. **NGO Table**:

   ```sql
   UPDATE ngo
   SET total_cc = total_cc - $amount, updated_at = NOW()
   WHERE ngo_id = $sellerId
   ```

2. **Buyer Table**:

   ```sql
   UPDATE buyer
   SET total_cc = total_cc + $amount, updated_at = NOW()
   WHERE buyer_id = $buyerId
   ```

#### Transaction Safety

- Uses PostgreSQL transactions (BEGIN/COMMIT/ROLLBACK)
- Both updates succeed together or both fail
- No partial updates possible

### Frontend Components

#### 1. API Service (`/frontend/src/api/transfer.js`)

- **Function**: `transferCarbonCredits(buyer_wallet_address, amount, tx_hash)`
- **Purpose**: Call backend transfer endpoint
- **Logging**: Logs request and response

#### 2. Updated Component (`/frontend/src/components/SellCCModal.jsx`)

- **Changes**:
  - Import `transferCarbonCredits` API function
  - Call backend API after blockchain success
  - Handle backend errors separately
  - Show success/error messages
  - Auto-close modal on complete success

## Logging Output

### Expected Backend Logs

When a CC transfer occurs, you will see:

```plaintext
🔵 Carbon Credit transfer route hit!
📝 Transfer request details: {
  sellerId: 1,
  sellerType: 'ngo',
  buyer_wallet_address: '0x...',
  amount: 100,
  tx_hash: '0x...'
}
🔍 Starting carbon credit transfer service...
🔄 Starting database transaction...
🔍 Fetching NGO details for ngo_id: 1...
📊 NGO current balance: 500 CC
🔍 Finding buyer with wallet address: 0x...
📊 Buyer current balance: 200 CC
🔍 Executing query: UPDATE ngo SET total_cc = total_cc - 100 WHERE ngo_id = 1
✅ NGO balance updated. New balance: 400 CC
🔍 Executing query: UPDATE buyer SET total_cc = total_cc + 100 WHERE buyer_id = 2
✅ Buyer balance updated. New balance: 300 CC
✅ Database transaction committed successfully!
🔓 Database connection released
✅ Carbon credit transfer completed successfully!
```

## API Specification

### Request

```http
POST /api/transfer/cc
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "buyer_wallet_address": "0x1234...",
  "amount": 100,
  "tx_hash": "0xabcd..."
}
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Carbon credits transferred successfully",
  "data": {
    "from": {
      "ngo_id": 1,
      "ngo_name": "Ocean Conservation NGO",
      "previous_balance": 500,
      "new_balance": 400
    },
    "to": {
      "buyer_id": 2,
      "company_name": "Green Corp",
      "previous_balance": 200,
      "new_balance": 300
    },
    "amount": 100,
    "tx_hash": "0xabcd...",
    "timestamp": "2025-10-30T12:00:00.000Z"
  }
}
```

### Error Responses

#### 400 Bad Request - Missing Fields

```json
{
  "success": false,
  "error": "buyer_wallet_address, amount, and tx_hash are required"
}
```

#### 400 Bad Request - Insufficient Balance

```json
{
  "success": false,
  "error": "Insufficient carbon credits. Available: 50, Required: 100"
}
```

#### 404 Not Found - Buyer Not Found

```json
{
  "success": false,
  "error": "Buyer not found with the provided wallet address"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Server error while transferring carbon credits"
}
```

## Testing

### Manual Testing Steps

1. **Login as NGO**

   - Ensure NGO has some `total_cc` balance

2. **Open Sell CC Modal**

   - Click "Sell Carbon Credits" button

3. **Enter Transfer Details**

   - Recipient wallet address (must match a buyer's wallet_address)
   - Amount to transfer

4. **Execute Transfer**

   - Approve MetaMask transaction
   - Wait for blockchain confirmation
   - **Watch backend terminal for logs**

5. **Verify**
   - Check backend logs for emoji-decorated messages
   - Verify database balances updated:

    ```sql
     SELECT ngo_id, ngo_name, total_cc FROM ngo;
     SELECT buyer_id, company_name, total_cc FROM buyer;
    ```

### Test Scenarios

| Scenario            | Expected Result                       |
| ------------------- | ------------------------------------- |
| Valid transfer      | ✅ Both blockchain and DB succeed     |
| Insufficient CC     | ❌ Error before DB update             |
| Invalid wallet      | ❌ Error: "Buyer not found"           |
| Blockchain fails    | ❌ No DB update (DB call not reached) |
| DB connection fails | ❌ Transaction rollback               |

## Security Considerations

1. **Authentication**: All endpoints protected by JWT
2. **Authorization**: Only NGOs can initiate transfers
3. **Validation**:
   - Wallet address format checked
   - Amount must be positive
   - Sufficient balance verified
4. **Atomic Transactions**: Prevents partial updates
5. **Transaction Hash**: Stored for audit trail

## Future Enhancements

1. **Transaction History Table**: Store all transfers for audit
2. **Email Notifications**: Notify both parties
3. **Webhook**: Real-time updates to frontend
4. **Rate Limiting**: Prevent spam transfers
5. **Multi-signature**: Require buyer confirmation

## Files Modified/Created

### Backend

- ✅ Created: `/backend/src/routes/transfer.js`
- ✅ Created: `/backend/src/controllers/transfer.controller.js`
- ✅ Created: `/backend/src/services/transfer.service.js`
- ✅ Modified: `/backend/src/routes/index.js`
- ✅ Modified: `/backend/app.js`

### Frontend

- ✅ Created: `/frontend/src/api/transfer.js`
- ✅ Modified: `/frontend/src/components/SellCCModal.jsx`

### Documentation

- ✅ Created: This file (`CARBON_CREDIT_TRANSFER.md`)

## Troubleshooting

### No Backend Logs Appearing

- Check if backend server is running
- Verify JWT token is valid
- Check network tab in browser DevTools
- Ensure `/api/transfer/cc` endpoint is registered

### Database Not Updating

- Check PostgreSQL connection
- Verify transaction not rolled back (check logs)
- Ensure NGO and Buyer exist in database
- Check wallet_address matches exactly (case-insensitive)

### Frontend Error Messages

- "MetaMask not found": Install MetaMask extension
- "Invalid recipient address": Check Ethereum address format
- "Buyer not found": Ensure buyer registered and wallet_address set
- "Insufficient carbon credits": NGO doesn't have enough CC

---

**Last Updated**: October 30, 2025
**Version**: 1.0.0
