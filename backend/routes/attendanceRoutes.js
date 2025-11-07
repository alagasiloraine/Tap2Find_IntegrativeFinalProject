import express from "express";
import {
  createAttendance,
  getAttendance,
  getAttendanceByUid,
  getTodayStats,
  getStatsByRange,
  getLatestAttendance,
  deleteAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

// POST endpoint for attendance records (used by ESP32)
router.post('/attendance', createAttendance);

// GET endpoints for retrieving data
router.get('/attendance', getAttendance);
router.get('/attendance/latest', getLatestAttendance);
router.get('/attendance/:uid', getAttendanceByUid);
router.get('/attendance/stats/today', getTodayStats);
router.get('/attendance/stats/range', getStatsByRange);

// DELETE endpoint (admin only)
router.delete('/api/attendance/:id', deleteAttendance);

export default router;
