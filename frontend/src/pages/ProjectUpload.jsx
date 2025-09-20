import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { projectApi } from "../api/projects";

// Form field names follow snake_case convention to align with the backend API contract.
// This ensures consistent data format between frontend and database schema.
export default function ProjectUpload() {
  const { isAuthenticated } = useAuth();
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
      // If not authenticated, show error and return
      if (!isAuthenticated) {
        alert("You must be logged in to upload a project.");
        return;
      }

      // Create a copy of the form data without photos for the initial project creation
      const { photos, ...projectData } = formData;

      // Convert string values to numbers for numeric fields
      projectData.tree_no = +projectData.tree_no;
      projectData.estimated_cc = +projectData.estimated_cc;

      // Submit the project data to the API
      const response = await projectApi.createProject(projectData);

      // If there are photos and project was created successfully, upload them
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

      // Clear the form on success
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

      // Show success message
      alert("Project uploaded successfully!");
      console.log("Project created:", response);
    } catch (error) {
      // Show error message
      alert(
        `Error uploading project: ${error.message || "Unknown error occurred"}`
      );
      console.error("Project upload error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcedd3]">
      <main className="flex-grow flex justify-center items-start pt-10">
        <form
          onSubmit={handle_submit}
          className="bg-white shadow-xl rounded-xl p-10 w-full max-w-3xl border border-gray-200"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
            Upload New Project
          </h1>

          {/* Plantation Area */}
          <label className="block text-gray-700 font-semibold mb-2">
            Plantation Area (in hectares)
          </label>
          <input
            type="text"
            name="plantation_area"
            value={formData.plantation_area}
            onChange={handleChange}
            placeholder="e.g., 25 hectares"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Location */}
          <label className="block text-gray-700 font-semibold mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Coastal Andhra Pradesh"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Tree Type */}
          <label className="block text-gray-700 font-semibold mb-2">
            Type of Trees
          </label>
          <input
            type="text"
            name="tree_type"
            value={formData.tree_type}
            onChange={handleChange}
            placeholder="e.g., Mangroves, Coconut"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Plantation Period */}
          <label className="block text-gray-700 font-semibold mb-2">
            Plantation Period
          </label>
          <input
            type="text"
            name="plantation_period"
            value={formData.plantation_period}
            onChange={handleChange}
            placeholder="e.g., June 2023 – Dec 2023"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Number of Trees */}
          <label className="block text-gray-700 font-semibold mb-2">
            Number of Trees
          </label>
          <input
            type="number"
            name="tree_no"
            value={formData.tree_no}
            onChange={handleChange}
            placeholder="e.g., 5000"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Photos Upload */}
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Photos (Geo-tagged)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full p-3 mb-4 border rounded-lg bg-gray-50"
          />
          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {previewImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Preview"
                  className="h-24 w-full object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          {/* Estimated CC */}
          <label className="block text-gray-700 font-semibold mb-2">
            Quote an Estimate for Carbon Credits
          </label>
          <input
            type="number"
            name="estimated_cc"
            value={formData.estimated_cc}
            onChange={handleChange}
            placeholder="e.g., 1200"
            className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            Upload Project
          </button>
        </form>
      </main>
    </div>
  );
}
