import express from "express";
import { registerUser, loginUser, verifyOTP, resendOTP, requestPasswordReset, resetPassword } from "../controllers/authController.js";
import { me, updateProfile } from "../controllers/studentprofileController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/resend-otp", resendOTP);
router.put("/profile", updateProfile);
router.get("/me", me);

// 🆕 Forgot password routes
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
