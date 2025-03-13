import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";
import { upload } from "../controllers/upload.js";

const uploadDist = multer({ dest: "public/uploads/" });

const router = express.Router();

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "developer"),
  uploadDist.single("file"),
  upload
);

export default router;
