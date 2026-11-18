import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: "Photo", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true, trim: true, maxlength: 500 }
}, { timestamps: true });


export default mongoose.model("Comment", commentSchema);
