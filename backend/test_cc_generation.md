### Self-Test for Carbon Credit Generation Flow

#### Backend Setup

1. **Install ethers.js**

   ```bash
   cd backend
   npm install ethers@6.15.0
   ```

2. **Configure .env file**
   - Ensure the backend/.env file has the following values:
   ```
   PROVIDER_URL=https://sepolia.infura.io/v3/your-infura-project-id
   ADMIN_PRIVATE_KEY=your_admin_private_key_here
   ```
   - Replace `your-infura-project-id` with a valid Infura project ID
   - Replace `your_admin_private_key_here` with the private key of the admin wallet that has permission to call `generateCredits` on the contract

#### Testing Flow

1. **Login as Admin**

   - Visit `/login/admin`
   - Enter credentials: admin@bluecarbon.com / admin123

2. **View Pending Projects**

   - Navigate to Admin Dashboard → Projects
   - Find a project with "pending" status

3. **Verify Wallet Setup**

   - Ensure the NGO associated with the project has a valid wallet address in the database
   - Ensure the wallet address format is correct (0x...)

4. **Approve Project**

   - Click "Approve" on a pending project
   - Watch for the loading indicator
   - Success should display a notification and update the project status to "minted"
   - The CC amount should be visible in the project details

5. **Verify Database Updates**

   - Check the project status in the database:
     ```sql
     SELECT * FROM project WHERE project_id = <approved_project_id>;
     ```
   - Verify status is "minted" and actual_cc is set

   - Check the NGO's total_cc has been updated:
     ```sql
     SELECT total_cc FROM ngo WHERE ngo_id = <seller_id>;
     ```

6. **Verify Blockchain Transaction**
   - Check the transaction hash from the logs
   - Verify on Sepolia Etherscan that the transaction was successful

#### Error Testing

1. **Invalid Wallet Address**

   - Update an NGO's wallet address to an invalid format
   - Try to approve their project
   - Verify the error message appears

2. **Missing Tree Count**

   - Try approving a project with tree_no = 0 or NULL
   - Verify the error message appears

3. **Contract Call Failure**
   - Use an incorrect admin private key
   - Try to approve a project
   - Verify the error message appears and project status remains "pending"

#### Notes

- All blockchain transactions are on Sepolia testnet
- The Smart Contract address is 0xacea7fa9e319ca2f1cadce88dd023887d017f741
- The admin wallet needs sufficient ETH for gas fees on Sepolia testnet
