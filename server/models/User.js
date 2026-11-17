import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 40 },
  lastName: { type: String, required: true, trim: true, maxlength: 40 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false }
}, { timestamps: true });
export default mongoose.model("User", userSchema);
