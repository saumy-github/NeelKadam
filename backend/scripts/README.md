Backend helper scripts

Files:

- `checkRole.js` - Check whether a given address has the NCCR role on-chain.
- `grantNCCR.js` - Grant the NCCR role to a target address (requires `DEPLOYER_PRIVATE_KEY` in `.env`).
- `estimateMint.js` - Estimate gas and cost for calling `generateCredits` for given NGO and amount.

Setup (backend/.env):

- `PROVIDER_URL` - RPC endpoint (Infura/Alchemy Sepolia URL)
- `DEPLOYER_PRIVATE_KEY` - (only needed for `grantNCCR.js`) private key of account that can call `grantRole`

Examples (PowerShell):

```powershell
# Check role
node .\backend\scripts\checkRole.js 0xBbdbC42794906b0120b34b80577E33aD7D283bBf

# Grant role (admin signs and pays gas)
node .\backend\scripts\grantNCCR.js 0xYourAddressHere

# Estimate gas for minting 10 credits to NGO
node .\backend\scripts\estimateMint.js 0x44C3A1E71509D341A76A529338Fe2e4dA1369bFF 10
```

Notes:

- Gas and role checks require a working `PROVIDER_URL` RPC endpoint. If you don't have one, create a free Infura/Alchemy project and set the URL.
- Be careful with private keys. Never commit `.env` with real private keys into source control.
