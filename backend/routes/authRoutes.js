import express from "express";
import { registerUser, loginUser, verifyOTP, resendOTP, requestPasswordReset, resetPassword } from "../controllers/authController.js";
import { changePassword, getSessions, signOutSession, signOutAllSessions } from "../controllers/studentsettingsController.js";
import { me, updateProfile } from "../controllers/studentprofileController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/resend-otp", resendOTP);
router.put("/profile", updateProfile);
router.get("/me", me);
router.put("/change-password", changePassword);

// Settings: Sessions & Security
router.get("/sessions", getSessions);
router.delete("/sessions/:id", signOutSession);
router.delete("/sessions", signOutAllSessions);

// 🆕 Forgot password routes
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;