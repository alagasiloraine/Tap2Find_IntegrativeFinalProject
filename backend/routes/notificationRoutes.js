import express from 'express'
import { getStudentNotifications, addNotification } from '../controllers/notificationController.js'

const router = express.Router()

router.get('/get-notification', getStudentNotifications)
router.post('/add-notification', addNotification)   

export default router
