import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  saveSessionFinals,
  saveSessionInitials,
} from "../controllers/gameSession.js";

const router = express.Router();

router.post(
  "/startGame",
  verifyToken,
  authorizeRoles("admin", "developer", "user"),
  saveSessionInitials
);
router.post(
  "/endGame",
  verifyToken,
  authorizeRoles("admin", "developer", "user"),
  saveSessionFinals
);

export default router;
