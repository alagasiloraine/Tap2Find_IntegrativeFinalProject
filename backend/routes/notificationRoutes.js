import express from 'express';
import {
  getUnreadNotifications,
  getAllNotifications,
  markNotificationAsRead,
  markAllAsRead,
  getUnreadNotificationCount,
  addNotification,
  createNotification,
  createStudentInquiryNotification,
  createInquiryResolvedNotification,
  clearAllNotifications,
  markMultipleNotificationsAsRead,
  getStudentNotifications,
  deleteNotificationsByIds,
  deleteAllNotificationsForUser,
} from '../controllers/notificationController.js';

const router = express.Router();

// Primary endpoints for the new system
router.get('/get-unread-notifications', getUnreadNotifications);
router.get('/get-all-notifications', getAllNotifications);
router.put('/mark-as-read/:notificationId', markNotificationAsRead);
router.put('/mark-all-read', markAllAsRead);
router.put('/mark-multiple-read', markMultipleNotificationsAsRead);
router.delete('/clear-all', clearAllNotifications);
router.get('/unread-count', getUnreadNotificationCount);

// Legacy endpoints (for backward compatibility)
router.get('/get-notification', getStudentNotifications);
router.post('/add-notification', addNotification);
router.post('/create-notification', createNotification);
router.post('/student-inquiry', createStudentInquiryNotification);
router.post('/inquiry-resolved', createInquiryResolvedNotification);

router.post('/delete', deleteNotificationsByIds)
router.post('/delete-all', deleteAllNotificationsForUser)

export default router;