import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../api/admin";
import AdminMetaMaskVerificationModal from "../components/AdminMetaMaskVerificationModal";

/**
 * AdminProjects.jsx
 * - List of projects submitted by NGOs
 * - Inspect details, approve/reject, add notes
 * - Using snake_case for data properties to match backend API contract
 */
export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // MetaMask verification modal state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { projectId, status }

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await adminApi.getAllProjects();
        setProjects(response.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Handle approval/rejection button click - show verification modal
  const handleStatusUpdate = (id, status) => {
    setPendingAction({ projectId: id, status });
    setShowVerificationModal(true);
  };

  // Execute the actual status update after MetaMask verification
  const updateStatus = async (verifiedAddress) => {
    if (!pendingAction) return;

    const { projectId, status } = pendingAction;

    try {
      setActionLoading(true);
      setShowVerificationModal(false);

      // Call the backend to approve/reject the project
      const approved = status === "approved";
      const result = await adminApi.approveProject(projectId, approved);

      // Update local state with the response
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === projectId
            ? {
                ...p,
                status: result.project.status,
                actual_cc: result.project.actual_cc || p.actual_cc,
              }
            : p
        )
      );

      // Show success notification with admin wallet info
      setNotification({
        type: "success",
        message: `${result.message} (Verified by: ${verifiedAddress.substring(0, 10)}...${verifiedAddress.substring(verifiedAddress.length - 8)})`,
      });
    } catch (err) {
      console.error("Error updating project status:", err);
      setNotification({
        type: "error",
        message:
          err.error || "Failed to update project status. Please try again.",
      });
    } finally {
      setActionLoading(false);
      setPendingAction(null);

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowVerificationModal(false);
    setPendingAction(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Project Verification</h2>
        <Link to="/admin/dashboard" className="text-sm underline">
          Back to Admin
        </Link>
      </div>

      {/* Notification display */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      ) : projects.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          No projects found for verification.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.project_id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">
                    {p.plantation_area || "Unnamed Project"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Seller: {p.seller_name} • Type: {p.seller_type} • Estimated
                    CC: {p.estimated_cc || 0}
                    {p.actual_cc ? ` • Actual CC: ${p.actual_cc}` : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {p.location || "Not specified"} • Trees:{" "}
                    {p.tree_no || 0} • Type: {p.tree_type || "Not specified"}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      p.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : p.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : p.status === "minted"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.status === "pending" && !actionLoading && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(p.project_id, "approved")}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={actionLoading}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(p.project_id, "rejected")}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        disabled={actionLoading}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {actionLoading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                  )}
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <p>Created: {new Date(p.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MetaMask Verification Modal */}
      <AdminMetaMaskVerificationModal
        isOpen={showVerificationModal}
        onClose={handleCloseModal}
        onVerified={updateStatus}
        action={pendingAction?.status === "approved" ? "approve this project" : "reject this project"}
      />
    </div>
  );
}
