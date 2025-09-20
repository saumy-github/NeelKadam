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
    {
      id: "what",
      title: "What Are We Doing",
      icon: <Target size={18} className="mr-2" />,
      img: "/about/what.jpg",
      content:
        "We focus on restoring and conserving blue carbon ecosystems—mangroves, seagrass meadows, and coastal wetlands—to capture and store atmospheric carbon.",
    },
    {
      id: "mission",
      title: "Our Mission",
      icon: <Info size={18} className="mr-2" />,
      img: "/about/mission.jpg",
      content:
        "To make climate action transparent and accessible through verified carbon credits and community-driven restoration projects.",
    },
    {
      id: "impact",
      title: "Our Impact",
      icon: <Globe size={18} className="mr-2" />,
      img: "/about/impact.jpg",
      content:
        "Our projects have supported large-scale restoration, improving biodiversity while sequestering substantial amounts of CO₂.",
    },
    {
      id: "technology",
      title: "Technology We Use",
      icon: <Cpu size={18} className="mr-2" />,
      img: "/about/tech.jpg",
      content:
        "We combine blockchain, AI, satellite imagery, and drones to ensure accurate measurement and immutable records.",
    },
    {
      id: "future",
      title: "Our Future Vision",
      icon: <Zap size={18} className="mr-2" />,
      img: "/about/future.jpg",
      content:
        "Scaling globally to include other critical carbon ecosystems while keeping communities at the center of the value chain.",
    },
    {
      id: "sustainability",
      title: "Sustainability",
      icon: <Leaf size={18} className="mr-2" />,
      img: "/about/sustain.jpg",
      content:
        "Sustainability for us includes biodiversity, livelihood security, and resilient coastal landscapes.",
    },
    {
      id: "community",
      title: "Community Engagement",
      icon: <Users size={18} className="mr-2" />,
      img: "/about/community.jpg",
      content:
        "We train and employ local communities to run and maintain restoration projects, ensuring fair revenue sharing.",
    },
    {
      id: "growth",
      title: "Growth Strategy",
      icon: <TrendingUp size={18} className="mr-2" />,
      img: "/about/growth.jpg",
      content:
        "Growth through partnerships, transparent reporting, and scalable verification methods.",
    },
    {
      id: "verification",
      title: "Verification & Trust",
      icon: <ShieldCheck size={18} className="mr-2" />,
      img: "/about/verify.jpg",
      content:
        "Independent audits, AI analytics, and blockchain-backed records form the backbone of our verification process.",
    },
    {
      id: "partnerships",
      title: "Partnerships",
      icon: <Heart size={18} className="mr-2" />,
      img: "/about/partners.jpg",
      content:
        "We collaborate with governments, NGOs, and research institutions to maximize impact.",
    },
    {
      id: "finance",
      title: "Financial Model",
      icon: <Coins size={18} className="mr-2" />,
      img: "/about/finance.jpg",
      content:
        "Our model ensures most revenue reaches communities while maintaining project sustainability.",
    },
    {
      id: "education",
      title: "Education & Awareness",
      icon: <BookOpen size={18} className="mr-2" />,
      img: "/about/education.jpg",
      content:
        "We run awareness and training programs to build long-term stewardship and capacity.",
    },
    {
      id: "next",
      title: "What's Next?",
      icon: <Zap size={18} className="mr-2" />,
      img: "/about/next.jpg",
      content:
        "We aim to expand our platform and become a trusted marketplace for verified blue carbon credits.",
    },
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

  const renderSection = (s, idx) => (
    <section
      id={s.id}
      key={s.id}
      ref={(el) => (sectionRefs.current[s.id] = el)}
      className="scroll-mt-20 flex items-center justify-center py-20 px-6 md:px-12 min-h-screen"
    >
      <div
        className={`max-w-6xl w-full grid gap-8 items-center md:grid-cols-2 ${
          idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {/* Text */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">{s.title}</h2>
          <p className="text-md md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {s.content}
          </p>
          <div className="mt-4">
            <button
              onClick={() => handleScrollTo(s.id)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="rounded-xl shadow-xl overflow-hidden bg-gray-100">
          <img
            src={s.img}
            alt={s.title}
            className="w-full h-64 md:h-96 object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );

return (
  <div className="relative min-h-screen bg-[#fcedd3]">
    {/* Sidebar - fixed on left, always visible */}
    <aside className="fixed left-0 top-0 w-72 h-screen bg-white border-r shadow-md p-6 overflow-auto">
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
    <main className="ml-72 flex-1 overflow-y-auto">
      {sections.map((s, idx) => renderSection(s, idx))}
    </main>
  </div>
);

}
