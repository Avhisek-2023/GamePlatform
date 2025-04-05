import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  create,
  getAllUsers,
  getUserById,
  getDetails,
  updateProfile,
} from "../controllers/user.js";

const router = express.Router();

router.get("/users/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});
router.get(
  "/users/developer",
  verifyToken,
  authorizeRoles("admin", "developer"),
  (req, res) => {
    res.json({ message: "Welcome developer" });
  }
);

//Profile

router.get(
  "/users/details",
  verifyToken,
  authorizeRoles("admin", "developer", "user"),
  getDetails
);
router.put(
  "/users/update-profile/:id",
  verifyToken,
  authorizeRoles("admin", "developer", "user"),
  updateProfile
);

//ADMIN ROUTES
router.get("/users/", verifyToken, authorizeRoles("admin"), getAllUsers);

router.get("/users/:id", verifyToken, authorizeRoles("admin"), getUserById);

router.post("/users/create", verifyToken, authorizeRoles("admin"), create);

export default router;
