// Task 4 and 5
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch all posts with filters
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts", {
        params: { q, category, page },
      });
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching posts:", err);
    }
  };

  // 🔹 Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // Trigger when search/filter/page changes
  useEffect(() => {
    fetchPosts();
  }, [q, category, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const prev = posts;
    setPosts(prev.filter((p) => p._id !== id)); // optimistic remove
    try {
      await api.delete(`/posts/${id}`);
    } catch (err) {
      setPosts(prev); // revert on failure
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Posts</h2>

      {/* 🔍 Search & Filter Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 📄 Posts List */}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div>
          {posts.map((p) => (
            <div
              key={p._id}
              className="border p-3 mb-3 rounded shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold">
                <Link
                  to={`/view/${p._id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {p.title}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {p.category?.name || "Uncategorized"}
              </p>
              <p>{p.body?.substring(0, 120)}...</p>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-500 mt-2 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
