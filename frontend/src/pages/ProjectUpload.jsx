import { useState } from "react";

export default function ProjectUpload() {
  const [formData, setFormData] = useState({
    plantationArea: "",
    location: "",
    treeType: "",
    plantationPeriod: "",
    treeNo: "",
    estimatedCC: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect with backend API
    console.log("Submitted Project:", formData);
    alert("Project uploaded successfully (demo)!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcedd3]">
      <main className="flex-grow flex justify-center items-start pt-10">
        <form
          onSubmit={handleSubmit}
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
            name="plantationArea"
            value={formData.plantationArea}
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
            name="treeType"
            value={formData.treeType}
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
            name="plantationPeriod"
            value={formData.plantationPeriod}
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
            name="treeNo"
            value={formData.treeNo}
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
            name="estimatedCC"
            value={formData.estimatedCC}
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
