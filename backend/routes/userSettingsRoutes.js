import express from 'express';
import {
  changePassword,
  getNotificationPreferences,
  updateNotificationPreferences,
  getActiveSessions,
  signOutSession,
  signOutAllSessions,
  getSecuritySettings,
  updateSecuritySettings
} from '../controllers/userSettingsController.js';

const router = express.Router();

// Password routes
router.post('/:userId/password/change', changePassword);

// Notification preferences routes
router.get('/:userId/notifications', getNotificationPreferences);
router.put('/:userId/notifications', updateNotificationPreferences);

// Session management routes
router.get('/:userId/sessions', getActiveSessions);
router.delete('/:userId/sessions/:sessionId', signOutSession);
router.delete('/:userId/sessions', signOutAllSessions);

// Security settings routes
router.get('/:userId/security', getSecuritySettings);
router.put('/:userId/security', updateSecuritySettings);

export default router;