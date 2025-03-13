import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { create, getAllUsers, getUserById } from "../controllers/user.js";

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

//ADMIN ROUTES
router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);

router.get("/:id", verifyToken, authorizeRoles("admin"), getUserById);

router.post("/create", verifyToken, authorizeRoles("admin"), create);

export default router;
