import fs from "fs";
import path from "path";
import Photo from "../models/Photo.js";
import Comment from "../models/Comment.js";

const userFields = "firstName lastName";
export async function getPhotos(_req, res) {
  const photos = await Photo.find().populate("userId", userFields).sort({ createdAt: -1 });
  res.json(photos);
}
export async function getPhoto(req, res) {
  const photo = await Photo.findById(req.params.id).populate("userId", userFields);
  if (!photo) return res.status(404).json({ message: "Photo not found." });
  const comments = await Comment.find({ photoId: photo._id })
    .populate("userId", userFields).sort({ createdAt: 1 });
  res.json({ photo, comments });
}
export async function createPhoto(req, res) {
  if (!req.file) return res.status(400).json({ message: "Please choose an image." });
  const title = (req.body.title || "").trim();
  if (!title) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: "Photo title is required." });
  }
  const photo = await Photo.create({
    userId: req.user._id, fileName: req.file.filename,
    title, description: (req.body.description || "").trim()
  });
  await photo.populate("userId", userFields);
  res.status(201).json(photo);
}
export async function deletePhoto(req, res) {
  const photo = await Photo.findById(req.params.id);
  if (!photo) return res.status(404).json({ message: "Photo not found." });
  if (photo.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the photo owner can delete it." });
  }
  
  const filePath = path.resolve("uploads", photo.fileName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await Comment.deleteMany({ photoId: photo._id });
  await photo.deleteOne();
  res.json({ message: "Photo deleted." });
}
export async function addComment(req, res) {
  const text = (req.body.comment || "").trim();
  if (!text) return res.status(400).json({ message: "Comment cannot be empty." });
  const photo = await Photo.findById(req.params.id);
  if (!photo) return res.status(404).json({ message: "Photo not found." });
  const comment = await Comment.create({ photoId: photo._id, userId: req.user._id, comment: text });
  await comment.populate("userId", userFields);
  res.status(201).json(comment);
}
