// Task 2 and 5
import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
} from "../controllers/postController.js";

const router = express.Router();

// GET all posts (with optional search/filter/pagination)
router.get("/", getPosts);

// GET single post by ID
router.get("/:id", getPostById);

// CREATE a new post
router.post("/", createPost);

// UPDATE a post
router.put("/:id", updatePost);

// DELETE a post
router.delete("/:id", deletePost);

// ADD a comment to a post
router.post("/:id/comments", addComment);

export default router;


