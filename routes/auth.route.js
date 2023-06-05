import express from "express";
import {
  login,
  signup,
  sendResetCode,
  setNewPassword,
  verifyCode,
} from "../controllers/auth.controller.js";
import {
  loginValidation,
  signupValidation,
  sendResetCodeValidation,
  setNewPassValidation,
  verifyCodeValidation,
} from "../utils/validations/auth-validator.js";

const router = express.Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/resetcode", sendResetCodeValidation, sendResetCode);
router.post("/verifyCode", verifyCodeValidation, verifyCode);
router.patch("/setpassword", setNewPassValidation, setNewPassword);

export default router;
