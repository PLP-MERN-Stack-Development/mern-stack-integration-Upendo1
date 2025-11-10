// Task 2
import mongoose from 'mongoose';
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

// Prevent OverwriteModelError when using hot reload or multiple imports
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export default Category;
