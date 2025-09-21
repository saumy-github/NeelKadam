// src/pages/Landing.jsx

import Hero from "../components/Hero";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === "blogs") {
      const section = document.getElementById("blogs");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const posts = [
    {
      id: 1,
      title: "Mangrove Restoration Boosts Blue Carbon Credits",
      description:
        "Community-driven mangrove planting along India’s coastline is generating measurable carbon credits and protecting biodiversity.",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
      date: "Sept 10, 2025",
    },
    {
      id: 2,
      title: "How Blockchain Ensures Transparency in MRV Systems",
      description:
        "Blockchain-powered registries are revolutionizing carbon markets by ensuring verifiable and immutable reporting.",
      image:
        "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=900&q=80",
      date: "Sept 5, 2025",
    },
    {
      id: 3,
      title: "Why Investors are Turning to Blue Carbon Projects",
      description:
        "Investors see mangrove restoration as a high-impact opportunity for both climate action and sustainable returns.",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
      date: "Aug 28, 2025",
    },
    {
      id: 4,
      title: "Seagrass Meadows: Hidden Climate Warriors",
      description:
        "Seagrass meadows capture carbon up to 35 times faster than tropical forests, yet remain overlooked in climate strategies.",
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
      date: "Aug 20, 2025",
    },
    {
      id: 5,
      title: "Local Communities Driving Coastal Protection",
      description:
        "Indigenous knowledge combined with modern tech is empowering coastal communities to safeguard their shorelines.",
      image:
        "https://images.unsplash.com/photo-1674255297865-19ffb5bfe2df?q=80&w=1936&auto=format&fit=crop",
      date: "Aug 10, 2025",
    },
    {
      id: 6,
      title: "The Rise of Nature-Based Carbon Solutions",
      description:
        "From mangroves to peatlands, nature-based solutions are emerging as the most scalable climate mitigation strategy.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      date: "July 30, 2025",
    },
  ];

  const questions = [
    {
      q: "What is Blue Carbon?",
      a: "Blue carbon refers to carbon stored within coastal and marine ecosystems. Mangroves, seagrass meadows, and salt marshes capture carbon extremely fast. Unlike terrestrial forests, they securely lock carbon for millennia ahead. These ecosystems provide protection from erosion, storms, and rising coastal threats. They also sustain fisheries, biodiversity, and support important coastal livelihoods. Global strategies now integrate blue carbon into nature-based climate solutions.",
      img: "/BCC2.jpg",
      fullScreen: false,
      padding: "py-12",
      xOffset: 0,
      yOffset: 0,
    },
    {
      q: "Why does Blue Carbon matter?",
      a: "These ecosystems not only store carbon, but also safeguard coastlines from erosion and storms. They sustain vital fisheries, preserve biodiversity, and support the livelihoods of coastal communities.",
      img: "/BC5.jpg",
      fullScreen: true,
      xOffset: -15,
      yOffset: 5,
    },
    {
      q: "How is Blue Carbon unique?",
      a: "Unlike land forests blue carbon ecosystems lock away carbon not just for years, but for centuries to millennia.They act as long-term climate buffers, while also nurturing rich biodiversity that sustains marine and coastal life.",
      img: "/BC2.jpg",
      fullScreen: false,
      padding: "py-2",
      xOffset: -15,
      yOffset: 2,
    },
    {
      q: "The Future of Blue Carbon",
      a: "Scaling the restoration and protection of blue carbon ecosystems is essential for meeting global climate goals. By expanding these efforts, we not only enhance carbon storage but also strengthen biodiversity, protect coastlines, and support sustainable livelihoods",
      img: "/BC4.jpg",
      fullScreen: true,
      xOffset: 0,
      yOffset: 0,
    },
    {
      q: "What role does it play in climate?",
      a: "Blue carbon is now being integrated into nature-based solutions for both climate change mitigation and adaptation. Coastal and marine ecosystems such as mangroves, seagrass meadows, and salt marshes are recognized as powerful carbon sinks that can store vast amounts of carbon for centuries. Beyond their climate benefits, these ecosystems provide natural protection against storms and rising sea levels, safeguard biodiversity, and sustain the livelihoods of millions of people living in coastal regions.",
      img: "/BC3.jpg",
      fullScreen: false,
      xOffset: 15,
      yOffset: -30,
    },
  ];

  return (
    <div className="scroll-smooth">
      <Hero />

      {/* Q&A Section */}
      <section id="why-blue-carbon" className="bg-[#fcedd3]">
        {questions.map((item, index) => {
          const ref = useRef(null);
          const { scrollYProgress } = useScroll({
            target: ref,
            offset: ["start end", "end start"],
          });
          const y = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);
          const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

          if (item.fullScreen) {
            return (
              <section
                key={index}
                ref={ref}
                className="relative h-screen w-full flex items-center m-0 p-0"
              >
                <motion.div className="absolute inset-6" style={{ y, scale }}>
                  <img
                    src={item.img}
                    alt={item.q}
                    className="w-full h-full object-cover m-0 p-0"
                  />
                  <div className="absolute inset-0 bg-black/50"></div>
                </motion.div>

                <div className="relative z-10 max-w-3xl px-8 text-left text-white">
                  <h2 className="text-5xl md:text-7xl font-bold leading-tight">
                    {item.q}
                  </h2>
                  <p className="mt-6 text-2xl font-light leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </section>
            );
          }

          return (
            <div
              key={index}
              ref={ref}
              className={`flex flex-col md:flex-row items-center gap-3 px-8 ${
                item.padding || "py-20"
              } bg-[#fcedd3] m-0 ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              <div className="flex-1 space-y-6">
                <h2 className="text-5xl md:text-6xl font-bold text-gray-700 leading-tight">
                  {item.q}
                </h2>
                <p className="text-2xl font-light text-gray-800 leading-relaxed max-w-prose">
                  {item.a}
                </p>
              </div>

              <motion.div
                className="flex-1"
                style={{
                  y: item.yOffset || 0,
                  x: item.xOffset || 0,
                }}
              >
                <img
                  src={item.img}
                  alt={item.q}
                  loading="lazy"
                  className="rounded-3xl shadow-lg w-full max-w-full object-cover h-[450px] m-0"
                />
              </motion.div>
            </div>
          );
        })}
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative h-screen w-full overflow-hidden">
        {/* Background with Parallax */}
        <motion.div
  className="absolute inset-0"
  style={{
    y: useTransform(useScroll().scrollYProgress, [0, 1], ["0%", "-20%"]),
  }}
>
  <div className="relative w-Screen h-Screen">
    <img
      src="/image.png"
      alt="Screen"
      className="w-Screen h-Screen object-cover"
    />
    <div className="absolute inset-0 bg-black/60"></div>
  </div>
</motion.div>


        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-12">
            Critical Storage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">
            <StatItem value={83} suffix="%" title="Global Carbon">
              83% of the global carbon cycle is circulated through the ocean.
            </StatItem>

            <StatItem value={2} suffix="%" title="Coastal Habitat Coverage">
              Coastal habitats cover less than 2% of the total ocean area.
            </StatItem>

            <StatItem value={50} suffix="%" title="Sediment Carbon">
              Coastal habitats account for approx half of the total carbon
              sequestered in ocean sediments.
            </StatItem>
          </div>

          <p className="mt-12 max-w-3xl text-xl md:text-2xl font-light leading-relaxed">
            Blue carbon ecosystems store up to 5x more carbon per hectare than
            tropical forests. Their destruction contributes ~10% of global
            emissions from deforestation, even though they cover less than 2% of
            the ocean area.
          </p>
        </div>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="py-16 px-0 overflow-hidden bg-transparent">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="mb-4">
            <span className="inline-block mt-5 px-4 py-1 text-sm font-semibold text-white bg-green-600 rounded-full shadow-md">
              New
            </span>
          </div>

          {/* Animated Heading */}
          <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 relative inline-block">
            {"Latest Blogs".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block transition-transform duration-150 ease-out hover:-translate-y-3 cursor-pointer"
                style={{ transitionDelay: `${i * 2}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-lg text-gray-500">
            Fresh updates, inspiring stories, and research you can’t miss.
          </p>
        </div>

        {/* Auto-scrolling container */}
        <div className="relative w-full overflow-visible">
          <motion.div
            className="flex space-x-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              ease: "linear",
              duration: 10,
              repeat: Infinity,
            }}
          >
            {[...posts, ...posts].map((post, index) => (
              <div
                key={index}
                className="flex-none w-80 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform hover:scale-105"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="h-48 w-full object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm text-gray-500">{post.date}</p>
                  <h3 className="text-xl font-semibold text-green-900">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 text-sm flex-grow">
                    {post.description}
                  </p>
                  <Link
                    to={`/blog/${post.id}`}
                    state={{ post, from: "home" }}
                    className="w-fit mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* StatItem with counting animation */
function StatItem({ value, suffix, title, children }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000; // 2 seconds
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [isInView, value]);

  return (
    <div ref={ref}>
      <p className="text-6xl font-extrabold">
        {count}
        {suffix}
      </p>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-lg font-light">{children}</p>
    </div>
  );
}
