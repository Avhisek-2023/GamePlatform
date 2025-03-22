import express from "express";
import {
  forget_password,
  login,
  logout,
  refreshToken,
  register,
  reset_password,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

router.post("/auth/forget-password", forget_password);

router.get("/auth/reset-password", reset_password);

router.post("/auth/refresh", refreshToken);
export default router;
