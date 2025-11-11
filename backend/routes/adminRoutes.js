import express from "express";
import { getDashboardStats } from "../controllers/admin/adminDashboardController.js";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/admin/adminUsersController.js";
import { getProfessors, uploadProfessorSchedule, downloadProfessorSchedule, getProfessorScheduleMeta } from "../controllers/admin/adminProfessorController.js";
import { getConcerns, getConcernById, updateConcernStatus, archiveConcern, deleteConcern, getConcernsDailyCounts } from "../controllers/admin/adminConcernsController.js";
import { getReportsSummary } from "../controllers/admin/adminReportController.js";
import { getAdminProfile, updateAdminProfile, uploadAdminPhoto } from "../controllers/admin/adminProfileController.js";
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

// Upload professor schedule to MongoDB (GridFS) using memory storage
const upload = multer({ storage: multer.memoryStorage() });
router.post("/professors/:id/schedule", upload.single("file"), uploadProfessorSchedule);
router.get("/professors/:id/schedule", downloadProfessorSchedule);
router.get("/professors/:id/schedule/meta", getProfessorScheduleMeta);

// Concerns
router.get("/concerns", getConcerns);
router.get("/concerns/daily", getConcernsDailyCounts);
router.get("/concerns/:id", getConcernById);
router.patch("/concerns/:id/status", updateConcernStatus);
router.patch("/concerns/:id/archive", archiveConcern);
router.delete("/concerns/:id", deleteConcern);

// Admin profile
router.get("/profile/:id", getAdminProfile);
router.patch("/profile/:id", updateAdminProfile);
router.post("/profile/:id/photo", upload.single("file"), uploadAdminPhoto);

// Reports
router.get("/reports/summary", getReportsSummary);

export default router;