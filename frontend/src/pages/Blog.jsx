// src/pages/Blog.jsx
import { Link } from "react-router-dom";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "Mangrove Restoration Boosts Blue Carbon Credits",
      description:
        "Community-driven mangrove planting along India’s coastline is generating measurable carbon credits and protecting biodiversity.",
      content: `Mangroves are vital ecosystems that store up to 10x more carbon than terrestrial forests. 
They protect coastlines, support fisheries, and now they also generate carbon credits. 
Communities along India’s coastline are engaging in large-scale mangrove restoration projects...`,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
      date: "Sept 10, 2025",
    },
    {
      id: 2,
      title: "How Blockchain Ensures Transparency in MRV Systems",
      description:
        "Blockchain-powered registries are revolutionizing carbon markets by ensuring verifiable and immutable reporting.",
      content: `Traditional MRV systems face challenges like data tampering, delays, and lack of trust. 
Blockchain solves these by creating immutable records. Every project is verified and stored...`,
      image:
        "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=900&q=80",
      date: "Sept 5, 2025",
    },
    {
      id: 3,
      title: "Why Investors are Turning to Blue Carbon Projects",
      description:
        "Investors see mangrove restoration as a high-impact opportunity for both climate action and sustainable returns.",
      content: `Investors are increasingly looking at blue carbon projects for their dual benefits: climate impact and financial sustainability. 
Projects provide verified carbon credits while supporting biodiversity and local communities...`,
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
      date: "Aug 28, 2025",
    },
    {
      id: 4,
      title: "Blue Carbon and Coastal Protection",
      description:
        "Mangroves not only store carbon but also protect coastlines from storms and erosion.",
      content: `Mangroves act as natural barriers against storm surges, protecting coastal communities. 
They reduce erosion, safeguard lives, and also contribute to carbon sequestration...`,
      image:
        "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=900&q=80",
      date: "Aug 20, 2025",
    },
    {
      id: 5,
      title: "Community-Driven Carbon Credits",
      description:
        "Local communities are playing a central role in carbon sequestration projects worldwide.",
      content: `Carbon markets are evolving to reward grassroots communities who actively plant and restore ecosystems. 
These initiatives both empower local people and generate verified credits...`,
      image:
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=900&q=80",
      date: "Aug 12, 2025",
    },
    {
      id: 6,
      title: "Tech in Climate Monitoring",
      description:
        "Drones and AI are transforming how we measure carbon sequestration in ecosystems.",
      content: `Cutting-edge technology now enables accurate, real-time monitoring of mangrove growth, 
making carbon accounting more efficient and reliable...`,
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
      date: "Aug 8, 2025",
    },
    {
      id: 7,
      title: "Future of Carbon Markets",
      description:
        "Tokenized credits are creating a global, secure, and efficient market for carbon trading.",
      content: `Blockchain-based tokenization of carbon credits is enabling cross-border climate action, 
with more liquidity, transparency, and accountability...`,
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
      date: "Aug 1, 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-900 text-center mb-12">
          🌍 Blue Carbon Blog
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6 space-y-3">
                <p className="text-sm text-gray-500">{post.date}</p>
                <h2 className="text-xl font-semibold text-green-900">
                  {post.title}
                </h2>
                <p className="text-gray-700 text-sm">{post.description}</p>
                <Link
                  to={`/blog/${post.id}`}
                  state={{ post, from: "blog" }}
                  className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
