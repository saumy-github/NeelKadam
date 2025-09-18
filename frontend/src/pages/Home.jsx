export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      
      {/* Section 1 */}
      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-3">🌍 About Blue Carbon Registry</h2>
        <p className="text-gray-700">
          The Blue Carbon Registry is a platform that helps NGOs, buyers, and governments
          track, verify, and trade carbon credits generated from coastal and marine ecosystems.
        </p>
      </section>

      {/* Section 2 */}
      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-3">📊 Why It Matters</h2>
        <p className="text-gray-700">
          Mangroves, seagrasses, and salt marshes absorb carbon faster than forests. 
          Our registry ensures transparency and credibility in climate action.
        </p>
      </section>

      {/* Section 3 */}
      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-3">🤝 Who Can Use It</h2>
        <p className="text-gray-700">
          NGOs can register projects, buyers can offset emissions, and admins maintain 
          quality assurance — all in one place.
        </p>
      </section>

      {/* Section 4 */}
      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-3">🚀 Get Started</h2>
        <p className="text-gray-700">
          Join us in protecting blue carbon ecosystems while enabling sustainable development.
        </p>
      </section>

    </div>
  );
}
