// import express from "express";
// import { 
//     getAllProfessors,
//     getStatistics,
//     getRecentConcerns,
//     getAllConcerns,
//     updateConcernStatus,
//     replyToConcern,
//     getConcernDetail,
//     getProfessorStatus,
//     getProfessorProfile, 
//     updateProfessorProfile,
//     updateProfessorStatus,
//     getProfessorActivities,
//     getProfessorLastUpdate,
//     getProfessorStatusHistory
//  } from "../controllers/professorController.js";

// const router = express.Router();

// // GET /api/professors
// router.get("/", getAllProfessors);

// // ✅ FIXED ROUTE ORDER - Specific routes first
// router.get("/statistics", getStatistics);
// router.get("/concerns/recent", getRecentConcerns);
// router.get("/concerns", getAllConcerns);
// router.get("/concerns/:id", getConcernDetail);
// router.patch("/concerns/:id", updateConcernStatus);
// router.post("/concerns/:id/reply", replyToConcern);

// // ✅ Status-related routes before general :id routes
// router.get("/:id/status", getProfessorStatus);
// router.put("/:id/status", updateProfessorStatus);
// router.get("/:id/activities", getProfessorActivities);

// // ✅ UID-based routes (more specific pattern)
// router.get('/last-update/:uid', getProfessorLastUpdate);
// router.get('/status-history/:uid', getProfessorStatusHistory);

// // ✅ General professor routes (keep these last)
// router.get('/:id', getProfessorProfile);
// router.put('/:id', updateProfessorProfile);

// export default router;


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
    getProfessorStatusHistory,
 } from "../controllers/professorController.js";

const router = express.Router();

// GET /api/professors
router.get("/", getAllProfessors);

// ✅ FIXED ROUTE ORDER - Specific routes first
router.get("/statistics", getStatistics);
router.get("/concerns/recent", getRecentConcerns);
router.get("/concerns", getAllConcerns);
router.get("/concerns/:id", getConcernDetail);
router.patch("/concerns/:id", updateConcernStatus);
router.post("/concerns/:id/reply", replyToConcern);

// ✅ Status-related routes before general :id routes
router.get("/:id/status", getProfessorStatus);
router.put("/:id/status", updateProfessorStatus);
router.get("/:id/activities", getProfessorActivities);

// ✅ UID-based routes (more specific pattern)
router.get('/last-update/:uid', getProfessorLastUpdate);
router.get('/status-history/:uid', getProfessorStatusHistory);

// ✅ General professor routes (keep these last)
router.get('/:id', getProfessorProfile);
router.put('/:id', updateProfessorProfile);

export default router;