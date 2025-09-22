import { useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // ✅ import Link

export default function Hero() {
  const bgRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const offset = window.scrollY * 0.6; // parallax speed
          if (bgRef.current) {
            bgRef.current.style.transform = `translateY(${offset}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className="relative h-screen overflow-hidden -mt-0">
      {/* Background with parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: "url('/bgimage.jpg')",
        }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-6">
        <h1 className="text-6xl md:text-7xl font-bold tracking-wide leading-tight drop-shadow-lg mb-6 pre-animate animate-fadeDown">
          Blockchain Blue Carbon Registry
        </h1>

        <p className="text-2xl md:text-3xl font-medium tracking-wide text-green-400 pre-animate animate-fadeDown anim-delay-300">
          Restore | Earn | Sustain
        </p>

        {/* Call to Action */}
        <div className="mt-8 flex gap-4 pre-animate animate-fadeDown anim-delay-600">
          {/* ✅ Navigate to About Page */}
          <Link
            to="/about"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-lg font-semibold rounded-xl shadow-lg transition"
          >
            Learn More
          </Link>

          <a
            href="#projects"
            className="px-6 py-3 border border-white hover:bg-white hover:text-black text-lg font-semibold rounded-xl transition"
          >
            Explore Projects
          </a>
        </div>
      </div>
    </section>
  );
}
