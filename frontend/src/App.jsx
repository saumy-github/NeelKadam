// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import NGO from "./pages/NGO";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Home from "./pages/Home";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Buyer from "./pages/Buyer";
import Login from "./pages/Login";
import NGOSignUp from "./pages/NGOSignUp";
import NgoDashboard from "./pages/NgoDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProjectUpload from "./pages/ProjectUpload";
import BuyerForgotPassword from "./pages/BuyerForgotPassword";
import BuyerSignup from "./pages/BuyerSignup";
import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerProfile from "./pages/BuyerProfile";
import BuyerTransactions from "./pages/BuyerTransactions";
import NGOProfile from "./pages/NGOProfile";

// import BuyerWallet from "./pages/BuyerWallet";
// import BuyerTransactions from "./pages/BuyerTransactions";

// ⬇️ import the three login pages
import LoginNgo from "./pages/LoginNGO";
import LoginBuyer from "./pages/LoginBUYER";
import LoginAdmin from "./pages/LoginADMIN";

// ⬇️ import the new AdminDashboard and admin feature pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminNGOs from "./pages/AdminNGOs";
import AdminBuyers from "./pages/AdminBuyers";
import AdminProjects from "./pages/AdminProjects";
import AdminCCList from "./pages/AdminCCList";
import AdminTransactions from "./pages/AdminTransactions";
import AdminReports from "./pages/AdminReports";

function App() {
  const location = useLocation();

  // ❌ Hide Navbar/Footer on ALL ngo, buyer, admin routes
  const hideNavbarPrefixes = ["/ngo", "/buyer", "/admin"];

  const shouldHideNavbar = hideNavbarPrefixes.some((prefix) =>
    location.pathname.toLowerCase().startsWith(prefix)
  );
  const shouldHideFooter = location.pathname.toLowerCase() === "/about";
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* ✅ Navbar visible everywhere except NGO/Buyer/Admin routes */}
      {!shouldHideNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ngo" element={<NGO />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/buyer" element={<Buyer />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/ngo" element={<LoginNgo />} />
          <Route path="/login/buyer" element={<LoginBuyer />} />
          <Route path="/login/admin" element={<LoginAdmin />} />

          {/* Signup & Forgot Password */}
          <Route path="/signup/ngo" element={<NGOSignUp />} />
          <Route path="/signup/buyer" element={<BuyerSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/buyer/forgot-password"
            element={<BuyerForgotPassword />}
          />

          {/* NGO Routes */}
          <Route path="/ngo/dashboard" element={<NgoDashboard />} />
          <Route path="/ngo/upload-project" element={<ProjectUpload />} />
          <Route path="/ngo/profile" element={<NGOProfile />} />

          {/* Buyer Routes */}
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/profile" element={<BuyerProfile />} />
          <Route path="/buyer/transactions" element={<BuyerTransactions />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/ngos" element={<AdminNGOs />} />
          <Route path="/admin/buyers" element={<AdminBuyers />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/cc" element={<AdminCCList />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/reports" element={<AdminReports />} />

          {/* Future Wallet/Transactions */}
          {/* <Route path="/buyer/wallet" element={<BuyerWallet />} /> */}
          {/* <Route path="/buyer/transactions" element={<BuyerTransactions />} /> */}

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center text-2xl text-red-600">
                404 – Page Not Found
              </div>
            }
          />
        </Routes>
      </main>
       {!shouldHideFooter && <Footer />}
  {/* ✅ Footer also hidden inside ngo/buyer/admin */}

    </div>
  );
}

// Wrap App with AuthProvider
function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;
