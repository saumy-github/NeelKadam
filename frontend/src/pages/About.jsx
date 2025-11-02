import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
  const { scrollY } = useScroll();

  const sections = useMemo(
    () => [
      {
        id: "what",
        title: "What Are We Doing",
        icon: <Target size={18} className="mr-2" />,
        img: "/A1.jpg",
        subtitle: "Restoration + Measurement + Markets",
        content:
          "We restore and conserve blue carbon ecosystems mangroves, seagrass meadows, and coastal wetlands so they can capture and store carbon for generations.",
        highlights: [
          "Native species-driven restoration",
          "Community employment and benefit sharing",
          "Science-backed monitoring and verification",
        ],
        color: "from-blue-500 to-cyan-500",
      },
      {
        id: "mission",
        title: "Our Mission",
        icon: <Info size={18} className="mr-2" />,
        img: "/A2.jpg",
        subtitle: "Transparency, Access, Impact",
        content:
          "Our mission is to make climate action transparent and accessible. We enable communities to participate in verified carbon markets.",
        highlights: [
          "Open data and verifiable records",
          "Direct community revenue streams",
          "Accessible project onboarding",
        ],
        color: "from-emerald-500 to-teal-500",
      },
      {
        id: "impact",
        title: "Our Impact",
        icon: <Globe size={18} className="mr-2" />,
        img: "/A3.jpg",
        subtitle: "Measured Outcomes",
        content:
          "We track biodiversity gains, coastline stabilization, and carbon sequestration through remote sensing and field measurements.",
        highlights: [
          "Quantified CO₂ removals",
          "Biodiversity and habitat recovery",
          "Resilient shorelines and fisheries support",
        ],
        color: "from-green-500 to-emerald-500",
      },
      {
        id: "technology",
        title: "Technology We Use",
        icon: <Cpu size={18} className="mr-2" />,
        img: "/T1.jpg",
        subtitle: "Tech + Ecology",
        content:
          "We use satellite imagery, drones, AI analytics, and blockchain to measure and verify restoration outcomes.",
        highlights: [
          "Automated remote sensing pipelines",
          "AI-assisted change detection",
          "Blockchain-backed credit provenance",
        ],
        color: "from-indigo-500 to-blue-500",
      },
      {
        id: "future",
        title: "Our Future Vision",
        icon: <Zap size={18} className="mr-2" />,
        img: "/F1.jpg",
        subtitle: "A Scalable Roadmap",
        content:
          "We plan to scale regionally and globally while maintaining local governance and benefit-sharing structures.",
        highlights: [
          "Replicable project playbooks",
          "Local governance and revenue sharing",
          "Cross-regional learning networks",
        ],
        color: "from-yellow-500 to-orange-500",
      },
      {
        id: "sustainability",
        title: "Sustainability",
        icon: <Leaf size={18} className="mr-2" />,
        img: "/S1.jpg",
        subtitle: "Holistic Sustainability",
        content:
          "Sustainability means thriving ecosystems and thriving people. We deliver biodiversity co-benefits and strengthen local economies.",
        highlights: [
          "Biodiversity-first restoration",
          "Long-term community stewardship",
          "Climate adaptation benefits",
        ],
        color: "from-lime-500 to-green-500",
      },
      {
        id: "community",
        title: "Community Engagement",
        icon: <Users size={18} className="mr-2" />,
        img: "/CM1.jpg",
        subtitle: "Local Leadership",
        content:
          "We hire and train local teams for restoration work while creating cooperative structures for direct benefit distribution.",
        highlights: [
          "Training and skills development",
          "Local monitoring teams",
          "Transparent benefit distribution",
        ],
        color: "from-pink-500 to-rose-500",
      },
      {
        id: "growth",
        title: "Growth Strategy",
        icon: <TrendingUp size={18} className="mr-2" />,
        img: "/A5.jpg",
        subtitle: "Partnership-Driven Growth",
        content:
          "We grow through strategic partnerships with governments and NGOs that amplify our reach and impact.",
        highlights: [
          "Research and academic partners",
          "Policy and government alignment",
          "Trusted market relationships",
        ],
        color: "from-purple-500 to-indigo-500",
      },
      {
        id: "verification",
        title: "Verification & Trust",
        icon: <ShieldCheck size={18} className="mr-2" />,
        img: "/FV1.jpg",
        subtitle: "Audit-Ready Verification",
        content:
          "Every data point is traceable to raw sensor data and audit reports, enabling buyer confidence.",
        highlights: [
          "Third-party audits",
          "Traceable sensor data",
          "Immutable transaction records",
        ],
        color: "from-cyan-500 to-blue-500",
      },
      {
        id: "partnerships",
        title: "Partnerships",
        icon: <Heart size={18} className="mr-2" />,
        img: "/Logo12.png",
        subtitle: "Strategic Partnerships",
        content:
          "Working with local NGOs and research institutes lets us blend scientific rigor with community knowledge.",
        highlights: [
          "Co-created project design",
          "Shared monitoring protocols",
          "Joint impact reporting",
        ],
        color: "from-red-500 to-pink-500",
      },
      {
        id: "finance",
        title: "Financial Model",
        icon: <Coins size={18} className="mr-2" />,
        img: "/BC1.jpg",
        subtitle: "Sustainable Financing",
        content:
          "We structure finance to support local implementation and long-term stewardship with transparent flows.",
        highlights: [
          "Transparent revenue flows",
          "Long-term stewardship funds",
          "Reinvestment into community services",
        ],
        color: "from-amber-500 to-yellow-500",
      },
      {
        id: "education",
        title: "Education & Awareness",
        icon: <BookOpen size={18} className="mr-2" />,
        img: "/S2.jpg",
        subtitle: "Capacity & Education",
        content:
          "Education programs provide technical training so restoration becomes a generational skill.",
        highlights: [
          "School and youth programs",
          "Field training workshops",
          "Knowledge-sharing platforms",
        ],
        color: "from-violet-500 to-purple-500",
      },
      {
        id: "next",
        title: "What's Next?",
        icon: <Zap size={18} className="mr-2" />,
        img: "/A4.jpg",
        subtitle: "What's Next",
        content:
          "We will broaden marketplace liquidity and lower verification costs to reach more communities.",
        highlights: [
          "More projects, more geographies",
          "Lower-cost verification pathways",
          "A fair, transparent marketplace",
        ],
        color: "from-orange-500 to-red-500",
      },
    ],
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  const renderSection = (s, idx) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });

    return (
      <section
        id={s.id}
        key={s.id}
        ref={(el) => {
          sectionRefs.current[s.id] = el;
          ref.current = el;
        }}
        className="scroll-mt-20 py-24 px-6 md:px-12 min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Static Background - No Animation */}
        <div className={`absolute inset-0 opacity-5 -z-10 blur-3xl bg-gradient-to-r ${s.color}`} />

        <div className="max-w-6xl w-full grid gap-12 items-center md:grid-cols-2 relative z-10">
          {/* Text Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                {s.title}
              </h2>
              {s.subtitle && (
                <p className={`mt-3 text-sm font-bold uppercase tracking-widest bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                  {s.subtitle}
                </p>
              )}
            </div>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {s.content}
            </p>

            {/* Highlights */}
            {s.highlights && (
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {s.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start text-gray-700 font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <span className={`inline-block mt-1 mr-3 w-2 h-2 rounded-full bg-gradient-to-r ${s.color} flex-shrink-0`} />
                    <span>{h}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Image */}
          <motion.div
            className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <img
              src={s.img}
              alt={s.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/image.png";
              }}
              className="w-full h-64 md:h-96 object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Static Background - No Animated Orbs */}
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 w-72 h-screen bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg p-6 overflow-y-auto z-40">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Navigation</h3>

        <nav className="flex-1">
          <ul className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => handleScrollTo(s.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                    active === s.id
                      ? `bg-gradient-to-r ${s.color} text-white shadow-lg`
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {s.icon} {s.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-gray-600 font-semibold mb-2">Progress</p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
              style={{
                width: `${(sections.indexOf(sections.find(s => s.id === active)) + 1) / sections.length * 100}%`,
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 overflow-y-auto">
        {sections.map((s, idx) => renderSection(s, idx))}

        {/* Footer */}
        <footer className="py-16 px-12 text-center border-t bg-white/50">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make an Impact?</h3>
          <p className="text-gray-600 mb-6">Join us in restoring coastal ecosystems.</p>
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </footer>
      </main>
    </div>
  );
}
