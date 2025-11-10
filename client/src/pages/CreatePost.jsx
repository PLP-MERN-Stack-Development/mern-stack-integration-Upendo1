// Task 4
import { useState, useEffect } from "react";
import api from "../services/api";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send JSON containing the selected category ObjectId (or empty string/null)
    try {
      await api.post("/posts", { title, body, category: category || null });
      alert("Post created successfully!");
      setTitle("");
      setBody("");
      setCategory("");
      setFile(null);
    } catch (err) {
      console.error("Create post failed:", err);
      alert("Create post failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />

      {/* Category select populated from server */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select category (optional)</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      {/* Keep file input for future upload if implemented server-side */}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
