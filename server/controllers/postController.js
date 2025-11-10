// server/controllers/postController.js
import Post from "../models/Post.js";

/**
 * ✅ GET /api/posts
 * Fetch all posts with optional filters (search, category, pagination)
 */
export const getPosts = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 5 } = req.query;

    const filter = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (category) filter.category = category;

    const total = await Post.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const posts = await Post.find(filter)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ posts, totalPages });
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

/**
 * ✅ GET /api/posts/:id
 * Fetch a single post by ID
 */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("category");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    res.status(500).json({ message: "Error fetching post" });
  }
};

/**
 * ✅ POST /api/posts
 * Create a new post
 */
export const createPost = async (req, res) => {
  try {
    const { title, body, category } = req.body;

    // Validate required fields
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const newPost = new Post({
      title,
      body,
      category: category || null,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(400).json({ message: "Failed to create post" });
  }
};

/**
 * ✅ PUT /api/posts/:id
 * Update an existing post
 */
export const updatePost = async (req, res) => {
  try {
    const { title, body, category } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, body, category },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("❌ Error updating post:", err);
    res.status(400).json({ message: "Failed to update post" });
  }
};

/**
 * ✅ DELETE /api/posts/:id
 * Delete a post
 */
export const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(400).json({ message: "Failed to delete post" });
  }
};

/**
 * ✅ POST /api/posts/:id/comments
 * Add a comment to a post
 */
export const addComment = async (req, res) => {
  try {
    const { text, author } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      text,
      author: author || "Anonymous",
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error("❌ Error adding comment:", err);
    res.status(400).json({ message: "Failed to add comment" });
  }
};
