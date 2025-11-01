// main.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppWithAuth from "./App.jsx"; // ✅ use AppWithAuth
import apiClient from "./api/config";
import "./index.css";

// Lightweight wrapper to warm up the backend (Render) on first page load.
function WarmUpWrapper({ children }) {
  useEffect(() => {
    // Fire-and-forget ping to wake backend; use root endpoint which is lightweight.
    (async () => {
      try {
        await apiClient.get("/");
        console.log("🔁 Backend warm-up ping succeeded");
      } catch (err) {
        // Don't block UX on failure; log for diagnostics.
        console.warn("⚠️ Backend warm-up ping failed:", err?.message || err);
      }
    })();
  }, []);

  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WarmUpWrapper>
        <AppWithAuth />
      </WarmUpWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
