// Task 5
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error loading post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      // server expects { text, author? }
      const res = await api.post(`/posts/${id}/comments`, { text: comment.trim() });
      // controller returns the updated post
      setPost(res.data);
      setComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading post...</p>;
  if (!post) return <p style={{ padding: 20 }}>Post not found.</p>;

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: 20 }}>
      <h2 style={{ fontSize: 24, marginBottom: 8 }}>{post.title}</h2>
      <p style={{ color: "#666", marginBottom: 16 }}>{post.category?.name || "Uncategorized"}</p>
      <div style={{ marginBottom: 24 }}>{post.body}</div>

      <section style={{ marginBottom: 24 }}>
        <h3>Comments ({post.comments?.length || 0})</h3>
        {post.comments?.length ? (
          <ul>
            {post.comments.map((c) => (
              <li key={c._id} style={{ marginBottom: 8 }}>
                <strong>{c.author || "Anonymous"}:</strong> {c.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </section>

      <form onSubmit={submitComment} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          rows={4}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <button type="submit" disabled={submitting} style={{ padding: "8px 12px" }}>
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default PostView;
