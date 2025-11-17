import express from "express";
import { 
    getAllProfessors,
    getStatistics,
    getRecentConcerns,
    getAllConcerns,
    updateConcernStatus,
    replyToConcern,
    getConcernDetail,
    getProfessorStatus,
    getProfessorProfile, 
    updateProfessorProfile,
    updateProfessorStatus,
    getProfessorActivities,
    getProfessorLastUpdate,
    getProfessorStatusHistory
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
router.get("/:id/status", getProfessorStatus); 

router.get('/:id', getProfessorProfile);
router.put('/:id', updateProfessorProfile);
router.put('/:id/status', updateProfessorStatus);
router.get('/:id/activities', getProfessorActivities);

router.get('/last-update/:uid', getProfessorLastUpdate);
router.get('/status-history/:uid', getProfessorStatusHistory);



export default router;
