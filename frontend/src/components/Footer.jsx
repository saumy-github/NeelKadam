// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-8">
      <div className="container mx-auto px-6 grid md:grid-cols-5 gap-10">
        {/* Brand */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-4">Neelkadam</h1>
          <p className="text-sm">
            Neelkadam is a platform dedicated to promoting sustainable practices
            and empowering communities by connecting people, organizations, and
            initiatives that make a difference.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">COMPANY</h3>
          <ul className="space-y-2">
            <li><Link to="/About.jsx" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        {/* Features → Blogs / Login */}
        <div>
          <h3 className="text-white font-semibold mb-4">EXPLORE</h3>
          <ul className="space-y-2">
            <li><Link to="/blogs" className="hover:text-white">Blogs</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">RESOURCES</h3>
          <ul className="space-y-2">
            <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
            <li><Link to="/faqs" className="hover:text-white">FAQs</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-4">LEGAL</h3>
          <ul className="space-y-2">
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Neelkadam – All rights reserved.
        </p>

        {/* Social Icons with SVG */}
        <div className="flex gap-6 mt-4 md:mt-0 text-xl">
          {/* Facebook */}
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35C.597 0 0 .598 0 1.333v21.333C0 23.403.597 24 1.325 24h11.483v-9.294H9.691v-3.622h3.117V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.243l-1.922.001c-1.508 0-1.799.717-1.799 1.767v2.317h3.588l-.467 3.622h-3.121V24h6.116C23.403 24 24 23.403 24 22.667V1.333C24 .598 23.403 0 22.675 0z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.35 3.608 1.325.975.975 1.263 2.242 1.325 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.35 2.633-1.325 3.608-.975.975-2.242 1.263-3.608 1.325-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.35-3.608-1.325-.975-.975-1.263-2.242-1.325-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.35-2.633 1.325-3.608.975-.975 2.242-1.263 3.608-1.325C8.416 2.175 8.796 2.163 12 2.163M12 0C8.741 0 8.332.014 7.052.072 5.775.13 4.638.422 3.678 1.382 2.718 2.342 2.426 3.479 2.368 4.756.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.058 1.277.35 2.414 1.31 3.374.96.96 2.097 1.252 3.374 1.31C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.414-.35 3.374-1.31.96-.96 1.252-2.097 1.31-3.374.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.058-1.277-.35-2.414-1.31-3.374C19.362.422 18.225.13 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm6.406-1.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM7.1 20.5H3.6V9h3.5v11.5zM5.3 7.5c-1.1 0-2-.9-2-2s.9-2 2-2c1.2 0 2.1.9 2.1 2s-.9 2-2.1 2zm15.2 13h-3.5v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7h-3.5V9h3.3v1.6h.1c.5-1 1.8-2.1 3.6-2.1 3.9 0 4.6 2.6 4.6 6.1v5.9z"/>
            </svg>
          </a>

          {/* YouTube */}
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.5 6.2c-.3-1.2-1.2-2.1-2.4-2.4C19 3.3 12 3.3 12 3.3s-7 0-9.1.5C1.7 4.1.8 5 .5 6.2.1 8.3 0 12 0 12s.1 3.7.5 5.8c.3 1.2 1.2 2.1 2.4 2.4C5 20.7 12 20.7 12 20.7s7 0 9.1-.5c1.2-.3 2.1-1.2 2.4-2.4.4-2.1.5-5.8.5-5.8s-.1-3.7-.6-5.8zM9.5 15.6V8.4l6.4 3.6-6.4 3.6z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
