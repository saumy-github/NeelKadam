import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [glass, setGlass] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const isHome = location.pathname === "/"; // ✅ only do effect on homepage

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (!hero) return;

      const heroBottom = hero.getBoundingClientRect().bottom;
      const triggerHeight = hero.offsetHeight * 0.3;

      if (heroBottom > triggerHeight) {
        setGlass(true);
      } else {
        setGlass(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToBlogs = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById("blogs");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const section = document.getElementById("blogs");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-16 flex items-center backdrop-blur-lg shadow-lg z-50 transition-all duration-500
      ${
        isHome
          ? glass
            ? "bg-gradient-to-b from-white/40 via-white/20 to-transparent text-white"
            : "bg-white text-black"
          : "bg-white text-black"
      }`}
    >
      <div className="flex items-center justify-between w-full px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-md">
            <img
              src="/Logo12.png"
              alt="Logo"
              className="h-10 w-10 object-contain filter brightness-125 contrast-125 drop-shadow"
            />
          </div>
          <span className="text-2xl font-bold flex items-center">
            NEELKADAM
          </span>
        </div>

        {/* Links */}
        <div className="flex space-x-6 text-lg font-medium items-center">
          <Link to="/" className="hover:text-green-400 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-green-400 transition">
            About
          </Link>

          {/* Login Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsLoginOpen(true)}
            onMouseLeave={() => setIsLoginOpen(false)}
          >
            <button className="flex items-center transition hover:text-green-400">
              <span className="hover:underline underline-offset-4">Login</span>
              <span className="ml-1 text-sm relative top-[-1.8px]">⌄</span>
            </button>

            {isLoginOpen && (
              <div className="absolute left-0 top-full flex flex-col items-start space-y-2 text-base font-medium p-2">
                <Link
                  to="/login/ngo"
                  className="px-4 py-1.5 hover:text-green-400 transition transform hover:translate-x-1"
                >
                  NGO
                </Link>
                <Link
                  to="/login/buyer"
                  className="px-4 py-1.5 hover:text-green-400 transition transform hover:translate-x-1"
                >
                  BUYER
                </Link>
                <Link
                  to="/login/admin"
                  className="px-4 py-1.5 hover:text-green-400 transition transform hover:translate-x-1"
                >
                  ADMIN
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={handleScrollToBlogs}
            className="hover:text-green-400 transition"
          >
            Blogs
          </button>
        </div>
      </div>
    </nav>
  );
}
