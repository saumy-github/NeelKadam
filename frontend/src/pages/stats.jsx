// src/pages/Stats.jsx

import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    {
      value: "5x",
      title: "Carbon Storage",
      description:
        "Blue carbon ecosystems store up to 5 times more carbon per hectare than tropical forests",
    },
    {
      value: "10%",
      title: "Global Emissions",
      description:
        "Their destruction contributes around 10% of global emissions from deforestation",
    },
    {
      value: "2%",
      title: "Ocean Coverage",
      description:
        "They cover less than 2% of the total ocean area, yet play a massive role in climate regulation.",
    },
  ];

  return (
    <section className="bg-[#fcedd3] py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-5xl md:text-7xl font-extrabold text-gray-800 mb-6">
          Blue Carbon Stats
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Blue carbon ecosystems punch far above their weight—storing vast
          amounts of carbon while covering a tiny fraction of the ocean.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-6xl font-extrabold text-green-700 mb-4">
                {stat.value}
              </h3>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                {stat.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
