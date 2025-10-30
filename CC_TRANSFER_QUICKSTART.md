# Carbon Credit Transfer - Quick Start Guide

## What Was Fixed

**Problem**: When NGOs transferred carbon credits to buyers via blockchain, the database was NOT updated.

**Solution**: Added a complete backend API endpoint that updates both NGO and Buyer balances after blockchain success.

## New Backend Endpoint

```plaintext
POST /api/transfer/cc
Authorization: Bearer <JWT_TOKEN>

Body:
{
  "buyer_wallet_address": "0x...",
  "amount": 100,
  "tx_hash": "0x..."
}
```

## Expected Backend Logs

When a CC transfer happens, you'll now see:

```plaintext
🔵 Carbon Credit transfer route hit!
📝 Transfer request details: { sellerId: 1, sellerType: 'ngo', ... }
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
✅ Carbon credit transfer completed successfully!
```

## Files Created

### Backend

- `backend/src/routes/transfer.js` - Route handler
- `backend/src/controllers/transfer.controller.js` - Request/response logic
- `backend/src/services/transfer.service.js` - Business logic with atomic transactions

### Frontend

- `frontend/src/api/transfer.js` - API client function

### Modified

- `backend/src/routes/index.js` - Added transfer route
- `backend/app.js` - Added endpoint to API listing
- `frontend/src/components/SellCCModal.jsx` - Calls backend API after blockchain success

## How It Works

1. **NGO clicks "Sell Carbon Credits"** in the modal
2. **Frontend**: Blockchain transaction via MetaMask
3. **Frontend**: After blockchain success, calls `/api/transfer/cc`
4. **Backend**: Atomic database transaction:
   - Verifies NGO has enough CC
   - Finds buyer by wallet address
   - Reduces NGO's `total_cc`
   - Increases Buyer's `total_cc`
   - Commits both updates together
5. **Success message** shown to user

## Database Tables Used

- **NGO table**: `total_cc` column (reduced)
- **Buyer table**: `total_cc` column (increased)

**No new tables created** - uses existing schema only!

## Testing

1. Login as NGO with some `total_cc` balance
2. Click "Sell Carbon Credits"
3. Enter buyer's wallet address and amount
4. Approve MetaMask transaction
5. **Watch backend terminal** - you'll see all the logs!
6. Check database to verify balances updated

## Verification

```sql
-- Check NGO balance
SELECT ngo_id, ngo_name, total_cc FROM ngo WHERE ngo_id = 1;

-- Check Buyer balance
SELECT buyer_id, company_name, total_cc FROM buyer WHERE buyer_id = 2;
```

---

For detailed documentation, see `CARBON_CREDIT_TRANSFER.md`
