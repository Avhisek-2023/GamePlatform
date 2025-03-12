import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});
router.get(
  "/developer",
  verifyToken,
  authorizeRoles("admin", "developer"),
  (req, res) => {
    res.json({ message: "Welcome developer" });
  }
);
router.get(
  "/user",
  verifyToken,
  authorizeRoles("admin", "developer", "user"),
  (req, res) => {
    res.json({ message: "Welcome User" });
  }
);

export default router;
