import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

import multer from "multer";
import {
  createProject,
  getAllProject,
  getDeveloperProject,
  uploadProject,
} from "../controllers/project.js";

const projectDist = multer({ dest: "public/uploads/" });

const router = express.Router();

//Developer

router.post(
  "/project/create",
  verifyToken,
  authorizeRoles("admin", "developer"),
  createProject
);
router.post(
  "/project/upload",
  verifyToken,
  authorizeRoles("admin", "developer"),
  projectDist.single("file"),
  uploadProject
);

router.get(
  "/projects/developer",
  verifyToken,
  authorizeRoles("admin", "developer"),
  getDeveloperProject
);

//Admin
router.get("/projects", verifyToken, authorizeRoles("admin"), getAllProject);

export default router;
