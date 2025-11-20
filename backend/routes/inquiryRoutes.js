import express from "express";
import { createInquiry, getInquiriesByStudent } from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/send", createInquiry);
router.get("/student/:studentId", getInquiriesByStudent);

export default router;