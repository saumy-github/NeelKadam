import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../api/admin";
import AdminMetaMaskVerificationModal from "../components/AdminMetaMaskVerificationModal";

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

      // Call the backend to approve/reject the project
      const approved = status === "approved";
      const result = await adminApi.approveProject(projectId, approved);

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

      // Show success notification
      setNotification({
        type: "success",
        message: result.message,
      });
    } catch (err) {
      console.error("Error updating project status:", err);
      setNotification({
        type: "error",
        message: err.error || "Failed to update project status. Please try again.",
      });
    } finally {
      setActionLoading(false);

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
    <div className="max-w-7xl mx-auto p-10 space-y-10 min-h-screen bg-slate-50">
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Project Verification</h2>
        <Link to="/admin/dashboard" className="text-indigo-600 hover:underline text-lg font-semibold">
          ← Back to Admin
        </Link>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-lg font-semibold ${
            notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          } shadow-md`}
        >
          {notification.message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-700"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center text-lg font-semibold">{error}</div>
      ) : projects.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center font-medium text-gray-700">
          No projects found for verification.
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((p) => (
            <div
              key={p.project_id}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-indigo-600 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start flex-wrap md:flex-nowrap gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-3xl font-bold text-gray-900 truncate">{p.plantation_area || "Unnamed Project"}</h3>
                  <p className="mt-2 text-gray-700 text-base sm:text-lg">
                    Seller: <span className="font-medium">{p.seller_name}</span> • Type: <span>{p.seller_type}</span>
                  </p>
                  <p className="mt-2 text-gray-700 text-base sm:text-lg">
                    Location: <span>{p.location || "Not specified"}</span> • Trees: <span>{p.tree_no || 0}</span> • Type: <span>{p.tree_type || "Not specified"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      p.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : p.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : p.status === "minted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
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
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-gray-700 text-base sm:text-lg">
                Created: {new Date(p.created_at).toLocaleDateString()}
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
