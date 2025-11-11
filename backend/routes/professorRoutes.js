import express from "express";
import { 
    getAllProfessors,
    getStatistics,
    getRecentConcerns,
    getAllConcerns,
    updateConcernStatus,
    replyToConcern,
    getConcernDetail
 } from "../controllers/professorController.js";

const router = express.Router();

// GET /api/professors
router.get("/", getAllProfessors);

router.get("/statistics", getStatistics);
router.get("/concerns/recent", getRecentConcerns);
router.get("/concerns", getAllConcerns);
router.get("/concerns/:id", getConcernDetail);
router.patch("/concerns/:id", updateConcernStatus);
router.post("/concerns/:id/reply", replyToConcern);

export default router;
