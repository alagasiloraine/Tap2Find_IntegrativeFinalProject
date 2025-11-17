import express from "express";
import {
  handleRfidTap,
  getRecentUnknownRfids,
  assignRfidToUser
} from '../controllers/attendanceController.js';

const router = express.Router();

// POST endpoint for RFID taps from ESP32
router.post('/attendance/rfid-tap', handleRfidTap);

// GET endpoint for recent unknown RFIDs (frontend polling)
router.get('/recent-unknown', getRecentUnknownRfids);

// POST endpoint for assigning RFID to user
router.post('/assign', assignRfidToUser);

export default router;