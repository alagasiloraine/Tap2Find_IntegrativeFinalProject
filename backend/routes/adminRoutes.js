import express from "express";
import { getDashboardStats } from "../controllers/admin/adminDashboardController.js";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/admin/adminUsersController.js";
import { 
  getProfessors, 
  uploadProfessorSchedule, 
  downloadProfessorSchedule, 
  getProfessorScheduleMeta,
  getProfessorSchedule,
  saveProfessorSchedule,
  getProfessorFullSchedule,
  addProfessor
} from "../controllers/admin/adminProfessorController.js";
import { getConcerns, getConcernById, updateConcernStatus, archiveConcern, deleteConcern } from "../controllers/admin/adminConcernsController.js";
import { getReportsSummary } from "../controllers/admin/adminReportController.js";
import multer from "multer";

const router = express.Router();

// Dashboard
router.get("/dashboard", getDashboardStats);
router.get("/stats", getDashboardStats); // alias

// Users
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Professors
router.get("/professors", getProfessors);
router.post("/add-professor", addProfessor);

// Manual Schedule Routes (NEW)
router.get("/professors/:id/schedule/manual", getProfessorSchedule);
router.post("/professors/:id/schedule/manual", saveProfessorSchedule);
router.get("/professors/:id/schedule/full", getProfessorFullSchedule);

// File-based Schedule Routes (EXISTING - keep for backward compatibility)
const upload = multer({ storage: multer.memoryStorage() });
router.post("/professors/:id/schedule", upload.single("file"), uploadProfessorSchedule);
router.get("/professors/:id/schedule", downloadProfessorSchedule);
router.get("/professors/:id/schedule/meta", getProfessorScheduleMeta);

// Concerns
router.get("/concerns", getConcerns);
router.get("/concerns/:id", getConcernById);
router.patch("/concerns/:id/status", updateConcernStatus);
router.patch("/concerns/:id/archive", archiveConcern);
router.delete("/concerns/:id", deleteConcern);

// Reports
router.get("/reports/summary", getReportsSummary);

export default router;