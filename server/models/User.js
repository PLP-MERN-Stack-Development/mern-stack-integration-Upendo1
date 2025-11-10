// Task 5
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ['user','admin','teacher'], default: 'user' }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
