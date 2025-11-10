import { useState, useEffect } from "react";
import api from "../services/api";

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // clear previous message

    if (!title || !body) {
      setMessage("❌ Please fill in both title and content.");
      return;
    }

    try {
      console.log("🔹 Sending post to backend:", { title, body, category });
      const res = await api.post("/posts", { title, body, category: category || null });
      console.log("✅ Post created:", res.data);
      setMessage("✅ Post created successfully!");
      setTitle("");
      setBody("");
      setCategory("");
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("❌ Error creating post:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
        setMessage(`❌ Failed: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        setMessage("❌ No response from server. Check if backend is running.");
      } else {
        setMessage(`❌ Request error: ${error.message}`);
      }
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", textAlign: "left" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Create New Post</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          background: "#f8f8f8",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <label>
          Title:
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "5px",
            }}
          />
        </label>

        <label>
          Content:
          <textarea
            placeholder="Write your post here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "5px",
            }}
          />
        </label>

        <label>
          Category (optional):
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "5px",
            }}
          >
            <option value="">-- Select category --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          style={{
            backgroundColor: "#333",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
            color: message.startsWith("✅") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default PostForm;
