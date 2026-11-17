import { Router } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPhotos, getPhoto, createPhoto, deletePhoto, addComment } from "../controllers/photoController.js";

const router = Router();
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads"),
  filename: (_req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, GIF, or WEBP images are allowed."));
  }
});
router.get("/", getPhotos);
router.get("/:id", getPhoto);
router.post("/", authMiddleware, upload.single("photo"), createPhoto);
router.delete("/:id", authMiddleware, deletePhoto);
router.post("/:id/comments", authMiddleware, addComment);
export default router;
