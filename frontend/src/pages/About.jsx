// src/pages/About.jsx
import { useEffect, useState, useRef } from "react";
import {
  Target,
  Info,
  Globe,
  Cpu,
  Zap,
  Leaf,
  Users,
  TrendingUp,
  ShieldCheck,
  Heart,
  Coins,
  BookOpen,
} from "lucide-react";

export default function About() {
  const [active, setActive] = useState("what");
  const sectionRefs = useRef({});

  const sections = [
    { id: "what", title: "What Are We Doing", icon: <Target size={18} className="mr-2" />, img: "/about/what.jpg" },
    { id: "mission", title: "Our Mission", icon: <Info size={18} className="mr-2" />, img: "/about/mission.jpg" },
    { id: "impact", title: "Our Impact", icon: <Globe size={18} className="mr-2" />, img: "/about/impact.jpg" },
    { id: "technology", title: "Technology We Use", icon: <Cpu size={18} className="mr-2" />, img: "/about/tech.jpg" },
    { id: "future", title: "Our Future Vision", icon: <Zap size={18} className="mr-2" />, img: "/about/future.jpg" },
    { id: "sustainability", title: "Sustainability", icon: <Leaf size={18} className="mr-2" />, img: "/about/sustain.jpg" },
    { id: "community", title: "Community Engagement", icon: <Users size={18} className="mr-2" />, img: "/about/community.jpg" },
    { id: "growth", title: "Growth Strategy", icon: <TrendingUp size={18} className="mr-2" />, img: "/about/growth.jpg" },
    { id: "verification", title: "Verification & Trust", icon: <ShieldCheck size={18} className="mr-2" />, img: "/about/verify.jpg" },
    { id: "partnerships", title: "Partnerships", icon: <Heart size={18} className="mr-2" />, img: "/about/partners.jpg" },
    { id: "finance", title: "Financial Model", icon: <Coins size={18} className="mr-2" />, img: "/about/finance.jpg" },
    { id: "education", title: "Education & Awareness", icon: <BookOpen size={18} className="mr-2" />, img: "/about/education.jpg" },
    { id: "next", title: "What's Next?", icon: <Zap size={18} className="mr-2" />, img: "/about/next.jpg" },
  ];

  // Intersection Observer → highlight active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  const renderSection = (id, title, content, img) => (
    <section
      id={id}
      key={id}
      ref={(el) => (sectionRefs.current[id] = el)}
      className="scroll-mt-20 flex items-center justify-center min-h-screen px-12"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl">
        {/* Text */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-gray-900">{title}</h1>
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>

        {/* Image */}
        <div className="rounded-xl shadow-lg overflow-hidden">
          <img
            src={img}
            alt={title}
            className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex bg-[#fcedd3]">
      {/* Sidebar - fixed on left */}
      <aside className="w-72 bg-white border-r shadow-md fixed top-16 bottom-0 left-0 p-6">
        <h2 className="font-bold mb-6 text-xl text-gray-900">About Us</h2>
        <ul className="space-y-2">
          {sections.map((s) => (
            <li
              key={s.id}
              onClick={() => handleScrollTo(s.id)}
              className={`cursor-pointer flex items-center px-3 py-2 rounded-md transition-all duration-200 ${
                active === s.id
                  ? "bg-green-600 text-white font-semibold"
                  : "hover:bg-green-100 text-gray-800"
              }`}
            >
              {s.icon} {s.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Scrollable Content */}
      <main className="ml-72 flex-1">
        {renderSection(
          "what",
          "What Are We Doing",
          `We are addressing one of the most pressing challenges of our time—climate change. Our focus is on blue carbon ecosystems such as mangroves, seagrass meadows, and coastal wetlands. These ecosystems act as powerful natural carbon sinks...`,
          "/about/what.jpg"
        )}

        {renderSection(
          "mission",
          "Our Mission",
          `Our mission is to make climate action transparent, measurable, and accessible. We aim to eliminate the inefficiencies in the current carbon market...`,
          "/about/mission.jpg"
        )}

        {renderSection(
          "impact",
          "Our Impact",
          `Our work has already contributed to thousands of hectares of ecosystem restoration, removing millions of tons of CO₂ from the atmosphere...`,
          "/about/impact.jpg"
        )}

        {renderSection(
          "technology",
          "Technology We Use",
          `Blockchain, AI, satellite data, and drones come together to create an ecosystem of trust, accuracy, and speed...`,
          "/about/tech.jpg"
        )}

        {renderSection(
          "future",
          "Our Future Vision",
          `We see ourselves scaling globally—expanding from coastal ecosystems to forests, peatlands, and grasslands...`,
          "/about/future.jpg"
        )}

        {renderSection(
          "sustainability",
          "Sustainability",
          `Sustainability for us means more than just carbon—it’s biodiversity, water security, and long-term resilience...`,
          "/about/sustain.jpg"
        )}

        {renderSection(
          "community",
          "Community Engagement",
          `Communities are at the heart of our platform. We empower them with training, fair pay, and a sense of ownership...`,
          "/about/community.jpg"
        )}

        {renderSection(
          "growth",
          "Growth Strategy",
          `We are scaling globally with partnerships, new technology adoption, and ecosystem expansion...`,
          "/about/growth.jpg"
        )}

        {renderSection(
          "verification",
          "Verification & Trust",
          `Every credit is backed by independent audits, immutable blockchain, and AI analysis...`,
          "/about/verify.jpg"
        )}

        {renderSection(
          "partnerships",
          "Partnerships",
          `We collaborate with governments, corporations, NGOs, and research institutions worldwide...`,
          "/about/partners.jpg"
        )}

        {renderSection(
          "finance",
          "Financial Model",
          `Our financial model ensures fair revenue distribution, with most of the value flowing directly to NGOs and communities...`,
          "/about/finance.jpg"
        )}

        {renderSection(
          "education",
          "Education & Awareness",
          `We invest in climate education, training, and awareness programs for communities, youth, and corporations...`,
          "/about/education.jpg"
        )}

        {renderSection(
          "next",
          "What's Next?",
          `We aim to become the backbone of voluntary carbon markets, making verified credits accessible everywhere...`,
          "/about/next.jpg"
        )}
      </main>
    </div>
  );
}
