import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { projectApi } from "../api/projects";

// Form field names follow snake_case convention to align with the backend API contract.
// This ensures consistent data format between frontend and database schema.
export default function ProjectUpload() {
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    plantation_area: "",
    location: "",
    tree_type: "",
    plantation_period: "",
    tree_no: "",
    estimated_cc: "",
    photos: [],
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: files,
    }));
    // Show previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    try {
      if (!isAuthenticated) {
        alert("You must be logged in to upload a project.");
        return;
      }

      const { photos, ...projectData } = formData;
      projectData.tree_no = +projectData.tree_no;
      projectData.estimated_cc = +projectData.estimated_cc;

      const response = await projectApi.createProject(projectData);

      if (photos.length > 0 && response.id) {
        try {
          await projectApi.uploadPhotos(response.id, photos);
          console.log("Photos uploaded successfully");
        } catch (photoError) {
          console.error("Error uploading photos:", photoError);
          alert(
            "Project was created, but there was an error uploading photos."
          );
        }
      }

      setFormData({
        plantation_area: "",
        location: "",
        tree_type: "",
        plantation_period: "",
        tree_no: "",
        estimated_cc: "",
        photos: [],
      });
      setPreviewImages([]);
      alert("Project uploaded successfully!");
      console.log("Project created:", response);
    } catch (error) {
      alert(
        `Error uploading project: ${error.message || "Unknown error occurred"}`
      );
      console.error("Project upload error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <main className="flex-grow flex justify-center items-start pt-16">
        <form
          onSubmit={handle_submit}
          className="bg-white shadow-2xl rounded-2xl p-12 w-full max-w-3xl border border-gray-200 animate-fade-in"
        >
          <h1 className="text-4xl font-bold text-center mb-10 text-green-700">
            Upload New Project
          </h1>

          {/* Plantation Area */}
          <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">
              Plantation Area (in hectares)
            </label>
            <input
              type="text"
              name="plantation_area"
              value={formData.plantation_area}
              onChange={handleChange}
              placeholder="e.g., 25 hectares"
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg bg-gradient-to-r from-emerald-50 to-white transition"
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Coastal Andhra Pradesh"
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg bg-gradient-to-r from-blue-50 to-white transition"
            />
          </div>

          {/* Tree Type */}
          <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">
              Type of Trees
            </label>
            <input
              type="text"
              name="tree_type"
              value={formData.tree_type}
              onChange={handleChange}
              placeholder="e.g., Mangroves, Coconut"
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-lg bg-gradient-to-r from-green-50 to-white transition"
            />
          </div>

          {/* Plantation Period */}
          <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">
              Plantation Period
            </label>
            <input
              type="text"
              name="plantation_period"
              value={formData.plantation_period}
              onChange={handleChange}
              placeholder="e.g., June 2023 – Dec 2023"
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-lg bg-gradient-to-r from-emerald-50 to-white transition"
            />
          </div>

          {/* Number of Trees */}
          <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">
              Number of Trees
            </label>
            <input
              type="number"
              name="tree_no"
              value={formData.tree_no}
              onChange={handleChange}
              placeholder="e.g., 5000"
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg bg-gradient-to-r from-blue-50 to-white transition"
            />
          </div>

          {/* Photos Upload */}
          <div className="mb-8">
            <label className="block text-gray-600 font-semibold mb-2">
              Upload Photos (Geo-tagged)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full p-4 border rounded-xl bg-gray-50 focus:outline-none"
            />
            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt="Preview"
                    className="h-24 w-full object-cover rounded-xl border shadow-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Estimated CC */}
          <div className="mb-8">
            <label className="block text-gray-600 font-semibold mb-2">
              Quote an Estimate for Carbon Credits
            </label>
            <input
              type="number"
              name="estimated_cc"
              value={formData.estimated_cc}
              onChange={handleChange}
              placeholder="e.g., 1200"
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg bg-gradient-to-r from-amber-50 to-white transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-400 text-white hover:bg-green-800 shadow-xl transition-all"
          >
            Upload Project
          </button>
        </form>
      </main>
    </div>
  );
}
