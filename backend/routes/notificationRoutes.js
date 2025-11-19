import express from 'express'
import { getStudentNotifications, addNotification, markAllNotificationsRead, deleteNotificationsByIds, deleteAllNotificationsForUser } from '../controllers/notificationController.js'

const router = express.Router()

router.get('/get-notification', getStudentNotifications)
router.post('/add-notification', addNotification)
router.post('/mark-all-read', markAllNotificationsRead)
router.post('/delete', deleteNotificationsByIds)
router.post('/delete-all', deleteAllNotificationsForUser)

export default router
