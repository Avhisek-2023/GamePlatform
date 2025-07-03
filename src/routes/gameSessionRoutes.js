import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createSession, getAllSession, updateSession } from "../controllers/gameSession.js";

const router = express.Router();

router.post(
  "/session/startGame",
  verifyToken,
  authorizeRoles("admin", "developer", "user"),
  createSession
);
router.put(
  "/session/endGame",
  verifyToken,
  authorizeRoles("admin", "developer", "user"),
  updateSession
);
router.get(
  "/sessions",
  verifyToken,
  authorizeRoles("admin", "developer", "user"),
  getAllSession
);

export default router;
