import express from "express";
import {
  forget_password,
  login,
  logout,
  register,
  reset_password,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forget-password", forget_password);

router.get("/reset-password", reset_password);
export default router;
