// Task 5
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import postRoutes from "./routes/posts.js";
import categoryRoutes from "./routes/categories.js";
import authRoutes from "./routes/auth.js"; // ✅ added
import Category from "./models/category.js"; // seed categories

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // optional — allows cookies/auth headers if used
  })
);
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes); // ✅ mount auth routes

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Seed default categories if none exist
    try {
      const count = await Category.countDocuments();
      if (count === 0) {
        const defaults = [
          { name: "General" },
          { name: "Announcements" },
          { name: "Tutorials" },
        ];
        await Category.insertMany(defaults);
        console.log("✅ Seeded default categories");
      }
    } catch (seedErr) {
      console.error("❌ Category seeding error:", seedErr);
    }
  })
  .catch((err) => console.error("❌ DB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
