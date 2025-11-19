import { getDB } from "../db.js";
import { ObjectId } from "mongodb";
import { 
  sendNotificationEmails, 
  sendInquiryEmailToProfessor, 
  sendInquiryResolvedEmailToStudent,
  sendGeneralAnnouncement,
  sendRoleSpecificNotification 
} from "./emailService.js";

export const getStudentNotifications = async (req, res) => {
  try {
    const { userId, userRole, onlyUnread } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const db = getDB();
    const notifications = db.collection("notifications");

    // Build the OR conditions based on user role / targeting
    const targetObjectId = new ObjectId(userId);

    const orConditions = [
      // General notifications - show to all roles
      { isGeneral: true },
    ];

    if (userRole === 'student') {
      // Students: general + student-targeted + notifications addressed to this student
      orConditions.push(
        { targetRole: 'student' },
        { studentId: targetObjectId },
      );
    } else if (userRole === 'professor') {
      // Professors: general + professor-targeted + notifications addressed to this professor
      orConditions.push(
        { targetRole: 'professor' },
        { professorId: targetObjectId },
      );
    } else {
      // Fallback: use generic userId field if present
      orConditions.push({ userId: targetObjectId });
    }

    // Build query: unread by default, unless onlyUnread explicitly set to 'false'
    const andConditions = [{ $or: orConditions }]
    if (onlyUnread !== 'false') {
      andConditions.push({ read: { $ne: true } })
    }

    const query = { $and: andConditions };

    const data = await notifications
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`📢 Fetched ${data.length} notifications for ${userRole} user: ${userId} (onlyUnread=${onlyUnread !== 'false'})`);

    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🧩 Add new notification with email
export const addNotification = async (req, res) => {
  try {
    const db = getDB();
    const notifications = db.collection("notifications");

    const {
      title,
      message,
      type,
      studentId,
      professorId,
      isGeneral = false,
      targetRole = null,
      sendEmail = true // New flag to control email sending
    } = req.body;

    const newNotification = {
      title,
      message,
      type,
      isGeneral,
      targetRole,
      read: false,
      createdAt: new Date(),
    };

    // 🎯 Assign notification target
    if (!isGeneral) {
      if (studentId) {
        newNotification.studentId = new ObjectId(studentId);
      } else if (professorId) {
        newNotification.professorId = new ObjectId(professorId);
      } else if (targetRole) {
        newNotification.targetRole = targetRole;
      } else {
        return res.status(400).json({
          success: false,
          message: "Either studentId, professorId, or targetRole is required for non-general notifications."
        });
      }
    }

    // 🧩 Insert into DB
    const result = await notifications.insertOne(newNotification);

    // 📧 Send email notification if enabled
    if (sendEmail) {
      try {
        await sendNotificationEmails({
          title,
          message,
          type,
          studentId,
          professorId,
          isGeneral,
          targetRole
        });
      } catch (emailError) {
        console.error("❌ Error sending notification email:", emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({ 
      success: true, 
      data: result,
      emailSent: sendEmail
    });

  } catch (error) {
    console.error("❌ Error adding notification:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createNotification = async (notificationData) => {
  try {
    const db = getDB();
    const notifications = db.collection("notifications");

    const {
      title,
      message,
      type,
      studentId,
      professorId,
      isGeneral = false,
      targetRole = null,
      sendEmail = true
    } = notificationData;

    const newNotification = {
      title,
      message,
      type,
      isGeneral,
      targetRole,
      read: false,
      createdAt: new Date(),
    };

    // 🎯 Assign notification target
    if (!isGeneral) {
      if (studentId) {
        newNotification.studentId = new ObjectId(studentId);
      } else if (professorId) {
        newNotification.professorId = new ObjectId(professorId);
      } else if (targetRole) {
        newNotification.targetRole = targetRole;
      } else {
        throw new Error("Either studentId, professorId, or targetRole is required for non-general notifications.");
      }
    }

    // 🧩 Insert into DB
    const result = await notifications.insertOne(newNotification);
    console.log('✅ Notification created:', result.insertedId);
    
    // 📧 Send email notification if enabled
    if (sendEmail) {
      try {
        await sendNotificationEmails({
          title,
          message,
          type,
          studentId,
          professorId,
          isGeneral,
          targetRole
        });
      } catch (emailError) {
        console.error("❌ Error sending notification email:", emailError);
        // Continue even if email fails
      }
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error adding notification:", error);
    throw error;
  }
};

// Specialized functions for common use cases
export const createStudentInquiryNotification = async (inquiryData) => {
  const { title, message, studentId, professorId, studentName } = inquiryData;
  
  // Create notification in database
  const notification = await createNotification({
    title: `New Inquiry: ${title}`,
    message: `You have a new inquiry from ${studentName}`,
    type: 'inquiry',
    professorId: professorId,
    sendEmail: true
  });

  // Send specific inquiry email to professor
  await sendInquiryEmailToProfessor(inquiryData, professorId);
  
  return notification;
};

export const createInquiryResolvedNotification = async (inquiryData) => {
  const { title, studentId, professorName } = inquiryData;
  
  // Create notification in database
  const notification = await createNotification({
    title: `Inquiry Resolved: ${title}`,
    message: `Your inquiry has been resolved by Professor ${professorName}`,
    type: 'inquiry',
    studentId: studentId,
    sendEmail: true
  });

  // Send resolution email to student
  await sendInquiryResolvedEmailToStudent(inquiryData, studentId);
  
  return notification;
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const { userId, userRole } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const db = getDB();
    const notifications = db.collection("notifications");

    const targetObjectId = new ObjectId(userId);

    const orConditions = [
      { isGeneral: true },
    ];

    if (userRole === 'student') {
      orConditions.push(
        { targetRole: 'student' },
        { studentId: targetObjectId },
      );
    } else if (userRole === 'professor') {
      orConditions.push(
        { targetRole: 'professor' },
        { professorId: targetObjectId },
      );
    } else {
      orConditions.push({ userId: targetObjectId });
    }

    const query = {
      $and: [
        { $or: orConditions },
        { read: { $ne: true } },
      ],
    };

    const result = await notifications.updateMany(query, { $set: { read: true } });

    console.log(`✅ Marked ${result.modifiedCount} notifications as read for ${userRole} user: ${userId}`);

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("❌ Error marking notifications as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🚮 Delete specific notifications by IDs
export const deleteNotificationsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "ids array is required" });
    }

    const db = getDB();
    const notifications = db.collection("notifications");
    const objectIds = ids.map((id) => new ObjectId(id));
    const result = await notifications.deleteMany({ _id: { $in: objectIds } });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error("❌ Error deleting notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🗑️ Delete ALL notifications for a user (scoped by role and target fields)
export const deleteAllNotificationsForUser = async (req, res) => {
  try {
    const { userId, userRole } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    const db = getDB();
    const notifications = db.collection("notifications");
    const targetObjectId = new ObjectId(userId);

    const orConditions = [{ isGeneral: true }];
    if (userRole === "student") {
      orConditions.push({ targetRole: "student" }, { studentId: targetObjectId });
    } else if (userRole === "professor") {
      orConditions.push({ targetRole: "professor" }, { professorId: targetObjectId });
    } else {
      orConditions.push({ userId: targetObjectId });
    }

    const result = await notifications.deleteMany({ $or: orConditions });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error("❌ Error deleting all notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};