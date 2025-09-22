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
  const [revealed, setRevealed] = useState([]);

  const sections = [
    {
      id: "what",
      title: "What Are We Doing",
      icon: <Target size={18} className="mr-2" />,
      img: "/A1.jpg",
      subtitle: "Restoration + Measurement + Markets",
      content:
        "We restore and conserve blue carbon ecosystems mangroves, seagrass meadows, and coastal wetlands so they can capture and store carbon for generations. Our approach combines hands-on ecological restoration with community partnerships, rigorous monitoring, and verified carbon credit markets so restoration becomes a durable local livelihood.",
      highlights: [
        "Native species-driven restoration",
        "Community employment and benefit sharing",
        "Science-backed monitoring and verification",
      ],
    },
    {
      id: "mission",
      title: "Our Mission",
  icon: <Info size={18} className="mr-2" />,
      img: "/A2.jpg",
      subtitle: "Transparency, Access, Impact",
      content:
        "Our mission is to make climate action transparent and accessible. We enable small communities and local custodians to participate in verified carbon markets by providing technical support, funding pathways, and a marketplace that prioritizes fairness and traceability.",
      highlights: [
        "Open data and verifiable records",
        "Direct community revenue streams",
        "Accessible project onboarding",
      ],
    },
    {
      id: "impact",
      title: "Our Impact",
  icon: <Globe size={18} className="mr-2" />,
      img: "/A3.jpg",
      subtitle: "Measured Outcomes",
      content:
        "Across our projects we track biodiversity gains, coastline stabilization, and carbon sequestration. By combining remote sensing with field measurements we publish robust impact reports that show how hectares restored translate into measurable climate and livelihood benefits.",
      highlights: [
        "Quantified CO₂ removals",
        "Biodiversity and habitat recovery",
        "Resilient shorelines and fisheries support",
      ],
    },
    {
      id: "technology",
      title: "Technology We Use",
  icon: <Cpu size={18} className="mr-2" />,
      img: "/T1.jpg",
      subtitle: "Tech + Ecology",
      content:
        "We use satellite imagery, drones, AI analytics, and blockchain to measure, verify, and transparently record restoration outcomes. These tools let us scale monitoring, reduce verification cost, and build immutable provenance for every tonne of carbon credited.",
      highlights: [
        "Automated remote sensing pipelines",
        "AI-assisted change detection",
        "Blockchain-backed credit provenance",
      ],
    },
    {
      id: "future",
      title: "Our Future Vision",
  icon: <Zap size={18} className="mr-2" />,
      img: "/F1.jpg",
      subtitle: "A Scalable Roadmap",
      content:
        "We plan to scale regionally and then globally bringing our model to other coastal geographies and ecosystem types. Scale is always paired with local governance: projects expand only when communities are ready and benefit-sharing structures are in place.",
      highlights: [
        "Replicable project playbooks",
        "Local governance and revenue sharing",
        "Cross-regional learning networks",
      ],
    },
    {
      id: "sustainability",
      title: "Sustainability",
  icon: <Leaf size={18} className="mr-2" />,
      img: "/S1.jpg",
      subtitle: "Holistic Sustainability",
      content:
        "Sustainability means thriving ecosystems and thriving people. Our projects are designed to deliver biodiversity co-benefits, strengthen local economies, and improve long-term coastal resilience against storms and sea-level rise.",
      highlights: [
        "Biodiversity-first restoration",
        "Long-term community stewardship",
        "Climate adaptation benefits",
      ],
    },
    {
      id: "community",
      title: "Community Engagement",
  icon: <Users size={18} className="mr-2" />,
      img: "/CM1.jpg",
      subtitle: "Local Leadership",
      content:
        "Community engagement is central. We hire and train local teams for nursery work, planting, monitoring, and long-term maintenance while creating cooperative structures so benefits flow directly to households.",
      highlights: [
        "Training and skills development",
        "Local monitoring teams",
        "Transparent benefit distribution",
      ],
    },
    {
      id: "growth",
      title: "Growth Strategy",
  icon: <TrendingUp size={18} className="mr-2" />,
      img: "/A5.jpg",
      subtitle: "Partnership-Driven Growth",
      content:
        "We grow through strategic partnerships with governments, research institutions, and NGOs that amplify our reach. Transparent reporting and rigorous verification keep partners and buyers confident in the impact.",
      highlights: [
        "Research and academic partners",
        "Policy and government alignment",
        "Trusted market relationships",
      ],
    },
    {
      id: "verification",
      title: "Verification & Trust",
  icon: <ShieldCheck size={18} className="mr-2" />,
      img: "/FV1.jpg",
      subtitle: "Audit-Ready Verification",
      content:
        "Verification combines independent audits with automated analytics. Every data point that informs a credit is traceable to raw sensor data and audit reports, enabling buyer confidence and regulatory compliance.",
      highlights: [
        "Third-party audits",
        "Traceable sensor data",
        "Immutable transaction records",
      ],
    },
    {
      id: "partnerships",
      title: "Partnerships",
  icon: <Heart size={18} className="mr-2" />,
      img: "/Logo12.png",
      subtitle: "Strategic Partnerships",
      content:
        "Partnerships extend our technical capacity and reach. Working with local NGOs, research institutes, and agencies lets us blend scientific rigor with community knowledge to deliver resilient projects.",
      highlights: [
        "Co-created project design",
        "Shared monitoring protocols",
        "Joint impact reporting",
      ],
    },
    {
      id: "finance",
      title: "Financial Model",
  icon: <Coins size={18} className="mr-2" />,
      img: "/BC1.jpg",
      subtitle: "Sustainable Financing",
      content:
        "We structure finance so the majority of funds support local implementation and long-term stewardship. Revenue flows are transparent and designed to reduce dependency on short-term grants.",
      highlights: [
        "Transparent revenue flows",
        "Long-term stewardship funds",
        "Reinvestment into community services",
      ],
    },
    {
      id: "education",
      title: "Education & Awareness",
  icon: <BookOpen size={18} className="mr-2" />,
      img: "/S2.jpg",
      subtitle: "Capacity & Education",
      content:
        "Education programs raise awareness and provide technical training to community members, youth groups, and school programs so restoration becomes a generational skill and source of pride.",
      highlights: [
        "School and youth programs",
        "Field training workshops",
        "Knowledge-sharing platforms",
      ],
    },
    {
      id: "next",
      title: "What's Next?",
  icon: <Zap size={18} className="mr-2" />,
      img: "/A4.jpg",
      subtitle: "What's Next",
      content:
        "Next we will broaden marketplace liquidity, add more verified project types, and continue lowering verification costs so high-integrity climate finance can reach more communities.",
      highlights: [
        "More projects, more geographies",
        "Lower-cost verification pathways",
        "A fair, transparent marketplace",
      ],
    },
  ];

  // Intersection Observer → highlight active section and mark revealed for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            setActive(id);
            setRevealed((prev) => (prev.includes(id) ? prev : [...prev, id]));
          }
        });
      },
      { threshold: 0.25 }
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
        <div
          className={`space-y-4 transform transition-all duration-700 ease-out ${
            revealed.includes(s.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">{s.title}</h2>
          {s.subtitle && (
            <p className="text-sm text-green-700 font-semibold uppercase tracking-wider">{s.subtitle}</p>
          )}
          <p className="text-md md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {s.content}
          </p>

          {/* Highlights */}
          {s.highlights && (
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {s.highlights.map((h, i) => (
                <li key={i} className="flex items-start text-gray-700">
                  <span className="inline-block mt-1 mr-2 w-2 h-2 rounded-full bg-green-600" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          
        </div>

        {/* Image */}
        <div
          className={`rounded-xl overflow-hidden bg-gray-100 transform transition-all duration-700 ease-out ${
            revealed.includes(s.id) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
          }`}
        >
          <img
            src={s.img}
            alt={s.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/image.png";
            }}
            className="w-full h-64 md:h-96 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );

return (
  <div className="relative min-h-screen bg-[#fcedd3]">
    {/* Sidebar - fixed on left, always visible */}
  <aside className="fixed left-0 top-16 w-72 h-[calc(100vh-4rem)] bg-white border-r shadow-md p-6 overflow-auto scrollbar-hide flex flex-col">
      {/* Navigation */}
      <nav className="mb-4 flex-1">
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
      </nav>
    </aside>

    {/* Scrollable Content */}
    <main className="ml-72 flex-1 overflow-y-auto">
      {sections.map((s, idx) => renderSection(s, idx))}
    </main>
  </div>
);

}
