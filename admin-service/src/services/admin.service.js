// Admin Service - Business logic layer
import * as AdminModel from "../models/admin.model.js";
import * as MainBackendClient from "./mainBackendClient.service.js";
import pool from "../config/database.config.js";

// Admin login (hardcoded for now)
export const adminLoginService = async (email, password) => {
  if (email === "admin@bluecarbon.com" && password === "admin123") {
    return {
      message: "Admin login successful",
      admin: { email: "admin@bluecarbon.com", role: "admin" },
      token: "admin-dummy-token",
    };
  } else {
    throw new Error("Invalid admin credentials");
  }
};

// Get all NGOs
export const getAllNGOsService = async (filters) => {
  const ngos = await AdminModel.getAllNGOs(filters);
  return { ngos };
};

// Get all buyers
export const getAllBuyersService = async (filters) => {
  const buyers = await AdminModel.getAllBuyers(filters);
  return { buyers };
};

// Get all projects
export const getAllProjectsService = async (filters) => {
  const projects = await AdminModel.getAllProjects(filters);
  return { projects };
};

// Get all transactions (placeholder)
export const getAllTransactionsService = async () => {
  return {
    transactions: [],
    message: "Transactions feature needs to be implemented",
  };
};

// Verify NGO
export const verifyNGOService = async (ngoId, verified) => {
  const updatedNGO = await AdminModel.updateNGOVerification(ngoId, verified);

  if (!updatedNGO) {
    throw new Error("NGO not found");
  }

  return {
    message: `NGO ${verified ? "verified" : "unverified"} successfully`,
    ngo: updatedNGO,
  };
};

// Verify buyer
export const verifyBuyerService = async (buyerId, verified) => {
  const updatedBuyer = await AdminModel.updateBuyerVerification(
    buyerId,
    verified
  );

  if (!updatedBuyer) {
    throw new Error("Buyer not found");
  }

  return {
    message: `Buyer ${verified ? "verified" : "unverified"} successfully`,
    buyer: updatedBuyer,
  };
};

// Approve or reject project
export const approveProjectService = async (projectId, approved) => {
  if (!approved) {
    const updatedProject = await AdminModel.updateProjectStatus(
      projectId,
      "rejected"
    );

    if (!updatedProject) {
      throw new Error("Project not found");
    }

    return {
      message: "Project rejected successfully",
      project: updatedProject,
    };
  }

  // Start a database transaction
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Get project details
    const project = await AdminModel.getProjectWithWallet(projectId);

    if (!project) {
      await client.query("ROLLBACK");
      throw new Error("Project not found");
    }

    const walletAddress = project.seller_wallet_address;

    if (!walletAddress) {
      await client.query("ROLLBACK");
      throw new Error("Seller has no wallet address registered");
    }

    // 2. Calculate carbon credits (CC) based on tree_no as per plan
    const actualCC = project.tree_no;

    if (!actualCC || actualCC <= 0) {
      await client.query("ROLLBACK");
      throw new Error("Invalid tree count for carbon credit calculation");
    }

    // 3. Update project status to "approved" and save actual_cc
    await client.query(
      "UPDATE project SET status = 'approved', actual_cc = $1, updated_at = CURRENT_TIMESTAMP WHERE project_id = $2",
      [actualCC, projectId]
    );

    // 4. Validate seller type (only NGO supported)
    if (project.seller_type !== "ngo") {
      await client.query("ROLLBACK");
      throw new Error("Only NGO seller type is supported in admin service");
    }

    // 5. Update seller's total_cc
    await client.query(
      "UPDATE ngo SET total_cc = total_cc + $1 WHERE ngo_id = $2",
      [actualCC, project.seller_id]
    );

    // Commit the transaction immediately to avoid long DB locks
    await client.query("COMMIT");

    // 6. Start minting carbon credits on the blockchain (non-blocking)
    // This runs in the background and doesn't block the API response
    MainBackendClient.generateCredits(walletAddress, actualCC)
      .then(async (mintResult) => {
        // Get a new client for follow-up DB updates
        const followUpClient = await pool.connect();
        try {
          if (mintResult.success) {
            // 7. If minting is successful, update project status to "minted"
            await followUpClient.query(
              "UPDATE project SET status = 'minted', updated_at = CURRENT_TIMESTAMP WHERE project_id = $1",
              [projectId]
            );
            // txHash is nested in data object from blockchain service
            const txHash = mintResult.data?.txHash || "unknown";
            console.log(
              `✅ Project ${projectId} successfully minted with tx: ${txHash}`
            );
          } else {
            console.error(
              `❌ Minting failed for project ${projectId}: ${
                mintResult.error || mintResult.message
              }`
            );
            // Optionally update status to indicate failed minting
            await followUpClient.query(
              "UPDATE project SET status = 'mint_failed', updated_at = CURRENT_TIMESTAMP WHERE project_id = $1",
              [projectId]
            );
          }
        } catch (err) {
          console.error("❌ Error in post-minting update:", err);
        } finally {
          followUpClient.release();
        }
      })
      .catch(async (err) => {
        console.error("⚠️ Background minting error:", err.message);

        // If it's a timeout error, the transaction might still succeed
        // Keep status as "approved" - admin can check blockchain later
        if (err.message && err.message.includes("timeout")) {
          console.log(
            `⏳ Timeout on project ${projectId} - transaction may still be mining on blockchain`
          );
        }
      });

    // Return success response - now indicates "approved" with minting in progress
    return {
      message: "Project approved and carbon credit minting initiated",
      project: {
        project_id: project.project_id,
        status: "approved", // Status is now "approved" until minting completes in background
        actual_cc: actualCC,
        minting_initiated: true,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Get dashboard statistics
export const getDashboardStatsService = async () => {
  const stats = await AdminModel.getDashboardStats();
  return { stats };
};

// Get reports
export const getReportsService = async (type, startDate, endDate) => {
  const data = await AdminModel.getReportsByType(type, startDate, endDate);
  return {
    reportType: type,
    data,
  };
};

// Get all projects with seller names
export const getAllProjectsWithSellerNamesService = async () => {
  const projects = await AdminModel.getAllProjectsWithSellerNames();
  return { projects };
};
