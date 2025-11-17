import express from 'express';
import { getStudentDashboard, getProfessorAvailability } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/student', getStudentDashboard)
router.get("/professors/availability", getProfessorAvailability);

export default router;