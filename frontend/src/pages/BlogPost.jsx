import { useLocation, Link, useNavigate } from "react-router-dom";

export default function BlogPost() {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;
  const from = location.state?.from;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-700">Blog not found</p>
        <Link to="/blog" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Back to Blogs
        </Link>
      </div>
    );
  }

  const handleBack = () => {
    if (from === "home") {
      // Go back to Home page and scroll to blogs section
      navigate("/", { state: { scrollTo: "blogs" } });
    } else {
      // Default: go to Blog listing page
      navigate("/blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <img src={post.image} alt={post.title} className="w-full h-80 object-cover rounded-2xl shadow-lg mb-8" />
        <h1 className="text-3xl font-bold text-green-900 mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{post.date}</p>
        <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">{post.content}</p>

        <button
          onClick={handleBack}
          className="inline-block mt-8 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
