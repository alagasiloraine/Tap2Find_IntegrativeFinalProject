import { getDB } from "../db.js";
import { ObjectId } from "mongodb";
import { 
  sendNotificationEmails, 
  sendInquiryEmailToProfessor, 
  sendInquiryResolvedEmailToStudent,
  sendGeneralAnnouncement,
  sendRoleSpecificNotification 
} from "../services/emailService.js";
import { sendSMS } from "../services/smsService.js";

// Helper function to get user notification preferences
export const getUserNotificationPreferences = async (userId) => {
  try {
    const db = getDB();
    const users = db.collection("users");
    
    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { notificationPreferences: 1 } }
    );
    
    // If user has no preferences, return default (both enabled)
    if (!user || !user.notificationPreferences) {
      return {
        enabled: true,
        channels: {
          email: true,
          sms: true
        }
      };
    }
    
    return user.notificationPreferences;
  } catch (error) {
    console.error("❌ Error fetching user notification preferences:", error);
    // Return default preferences on error
    return {
      enabled: true,
      channels: {
        email: true,
        sms: true
      }
    };
  }
};

// 🎯 Get only unread notifications for a specific user
export const getUnreadNotifications = async (req, res) => {
  try {
    const { userId, userRole } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const db = getDB();
    const notifications = db.collection("notifications");
    const notificationReads = db.collection("notification_reads");

    const userIdObj = new ObjectId(userId);

    // Get ALL notifications
    const allNotifications = await notifications.find({}).sort({ createdAt: -1 }).toArray();

    // console.log('🔍 DEBUG - Manual filtering for user:', userId);
    
    // Manual filtering with PRIORITY LOGIC
    const visibleNotifications = allNotifications.filter(notification => {
      const notifStudentId = notification.studentId ? notification.studentId.toString() : null;
      const notifUserId = notification.userId ? notification.userId.toString() : null;
      
      // console.log(`\n🔍 Checking: "${notification.title}"`);
      // console.log(`   studentId: ${notifStudentId}, targetRole: ${notification.targetRole}, isGeneral: ${notification.isGeneral}`);

      // PRIORITY 1: User-specific notifications (highest priority)
      if (notifUserId && notifUserId === userId) {
        console.log(`   ✅ USER-SPECIFIC - userId matches exactly`);
        return true;
      }

      // PRIORITY 2: Student-specific notifications
      if (notifStudentId) {
        if (userRole === 'student' && notifStudentId === userId) {
          // console.log(`   ✅ STUDENT-SPECIFIC - studentId matches exactly`);
          return true;
        } else {
          // console.log(`   ❌ STUDENT-SPECIFIC - studentId ${notifStudentId} ≠ ${userId} - HIDING`);
          return false; // Explicitly hide if studentId doesn't match
        }
      }

      // PRIORITY 3: Professor-specific notifications
      if (notification.professorId && notification.professorId.toString() === userId && userRole === 'professor') {
        // console.log(`   ✅ PROFESSOR-SPECIFIC - professorId matches exactly`);
        return true;
      }

      // PRIORITY 4: Role-specific notifications (ONLY if no user-specific fields exist)
      if (notification.targetRole === userRole && !notifStudentId && !notifUserId && !notification.professorId) {
        // console.log(`   ✅ ROLE-SPECIFIC - for ${userRole} role`);
        return true;
      }

      // PRIORITY 5: General notifications (lowest priority)
      if (notification.isGeneral && !notifStudentId && !notifUserId && !notification.professorId && !notification.targetRole) {
        // console.log(`   ✅ GENERAL - visible to all`);
        return true;
      }

      // console.log(`   ❌ NO MATCH - Hiding notification`);
      return false;
    });

    console.log(`\n🎯 RESULTS: ${visibleNotifications.length} visible notifications`);

    // Get read status
    const readStatuses = await notificationReads.find({
      userId: userIdObj,
      notificationId: { $in: visibleNotifications.map(n => n._id) }
    }).toArray();

    const readNotificationIds = new Set(readStatuses.map(rs => rs.notificationId.toString()));

    // Filter out read notifications
    const unreadNotifications = visibleNotifications.filter(notification => 
      !readNotificationIds.has(notification._id.toString())
    );

    console.log(`📢 FINAL: ${unreadNotifications.length} unread notifications\n`);

    res.json({ success: true, data: unreadNotifications });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🎯 Get all notifications (read and unread) for notification history page
export const getAllNotifications = async (req, res) => {
  try {
    const { userId, userRole } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const db = getDB();
    const notifications = db.collection("notifications");
    const notificationReads = db.collection("notification_reads");

    // Get ALL notifications first
    const allNotifications = await notifications
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    console.log('🔍 getAllNotifications - Strict filtering for user:', userId);
    
    // Apply the same strict filtering logic
    const visibleNotifications = allNotifications.filter(notification => {
      const notifStudentId = notification.studentId ? notification.studentId.toString() : null;
      const notifUserId = notification.userId ? notification.userId.toString() : null;
      const notifProfessorId = notification.professorId ? notification.professorId.toString() : null;

      console.log(`\n🔍 "${notification.title}"`);
      console.log(`   studentId: ${notifStudentId}, userId: ${notifUserId}, professorId: ${notifProfessorId}`);
      console.log(`   targetRole: ${notification.targetRole}, isGeneral: ${notification.isGeneral}`);

      // 🚫 FIRST: Check if this notification has ANY user-specific field that DOESN'T match
      if (notifStudentId && notifStudentId !== userId) {
        console.log(`   ❌ HAS studentId ${notifStudentId} that DOES NOT match ${userId} - HIDING`);
        return false;
      }
      if (notifUserId && notifUserId !== userId) {
        console.log(`   ❌ HAS userId ${notifUserId} that DOES NOT match ${userId} - HIDING`);
        return false;
      }
      if (notifProfessorId && notifProfessorId !== userId) {
        console.log(`   ❌ HAS professorId ${notifProfessorId} that DOES NOT match ${userId} - HIDING`);
        return false;
      }

      // ✅ NOW: Check if this notification should be visible
      
      // User-specific matches
      if (notifStudentId && notifStudentId === userId) {
        console.log(`   ✅ studentId matches exactly`);
        return true;
      }
      if (notifUserId && notifUserId === userId) {
        console.log(`   ✅ userId matches exactly`);
        return true;
      }
      if (notifProfessorId && notifProfessorId === userId) {
        console.log(`   ✅ professorId matches exactly`);
        return true;
      }

      // Role-specific (only if no user-specific fields)
      if (notification.targetRole === userRole && !notifStudentId && !notifUserId && !notifProfessorId) {
        console.log(`   ✅ role-specific for ${userRole}`);
        return true;
      }

      // General (only if no user-specific or role-specific fields)
      if (notification.isGeneral && !notifStudentId && !notifUserId && !notifProfessorId && !notification.targetRole) {
        console.log(`   ✅ general notification`);
        return true;
      }

      console.log(`   ❌ no matching conditions`);
      return false;
    });

    console.log(`\n🎯 getAllNotifications RESULTS: ${visibleNotifications.length} visible notifications out of ${allNotifications.length} total`);

    // Get read status for these notifications
    const readStatuses = await notificationReads
      .find({
        userId: new ObjectId(userId),
        notificationId: { $in: visibleNotifications.map(n => n._id) }
      })
      .toArray();

    const readStatusMap = new Map();
    readStatuses.forEach(rs => {
      readStatusMap.set(rs.notificationId.toString(), true);
    });

    // Add read status to each notification
    const notificationsWithReadStatus = visibleNotifications.map(notification => ({
      ...notification,
      read: readStatusMap.has(notification._id.toString())
    }));

    console.log(`📢 Fetched ${notificationsWithReadStatus.length} total notifications for ${userRole} user: ${userId}`);

    res.json({ success: true, data: notificationsWithReadStatus });
  } catch (error) {
    console.error("❌ Error fetching all notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🎯 Mark notification as read for a specific user
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    if (!notificationId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing notificationId or userId" 
      });
    }

    const db = getDB();
    const notifications = db.collection("notifications");
    const notificationReads = db.collection("notification_reads");

    // First, verify the notification exists and user has access to it
    const notification = await notifications.findOne({
      _id: new ObjectId(notificationId),
      $or: [
        { studentId: new ObjectId(userId) },
        { professorId: new ObjectId(userId) },
        { userId: new ObjectId(userId) },
        { isGeneral: true },
        { targetRole: { $exists: true } }
      ]
    });

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: "Notification not found or access denied" 
      });
    }

    // Record that this user has read this notification
    const readRecord = {
      userId: new ObjectId(userId),
      notificationId: new ObjectId(notificationId),
      readAt: new Date()
    };

    // Use upsert to avoid duplicates
    await notificationReads.updateOne(
      {
        userId: new ObjectId(userId),
        notificationId: new ObjectId(notificationId)
      },
      { $set: readRecord },
      { upsert: true }
    );

    console.log(`✅ Notification ${notificationId} marked as read by user ${userId}`);
    
    res.json({ 
      success: true, 
      message: "Notification marked as read" 
    });

  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🎯 Mark all notifications as read for a specific user
export const markAllAsRead = async (req, res) => {
  try {
    const { userId, userRole } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing userId" 
      });
    }

    const db = getDB();
    const notifications = db.collection("notifications");
    const notificationReads = db.collection("notification_reads");

    // Get all unread notifications for this user
    const query = {
      $or: [
        { isGeneral: true },
        { userId: new ObjectId(userId) },
      ]
    };

    if (userRole === 'student') {
      query.$or.push({ targetRole: 'student' });
    } else if (userRole === 'professor') {
      query.$or.push({ targetRole: 'professor' });
    }

    const userNotifications = await notifications
      .find(query)
      .toArray();

    // Get already read notifications to avoid duplicates
    const existingReads = await notificationReads
      .find({ userId: new ObjectId(userId) })
      .toArray();

    const existingReadIds = new Set(existingReads.map(er => er.notificationId.toString()));

    // Create read records for all unread notifications
    const readRecords = userNotifications
      .filter(notification => !existingReadIds.has(notification._id.toString()))
      .map(notification => ({
        userId: new ObjectId(userId),
        notificationId: notification._id,
        readAt: new Date()
      }));

    // Bulk insert all read records
    if (readRecords.length > 0) {
      await notificationReads.insertMany(readRecords);
    }

    console.log(`📖 Marked ${readRecords.length} notifications as read for user ${userId}`);
    
    res.json({ 
      success: true, 
      message: `${readRecords.length} notifications marked as read`,
      markedCount: readRecords.length
    });

  } catch (error) {
    console.error("❌ Error marking all notifications as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🎯 Get unread notification count
export const getUnreadNotificationCount = async (req, res) => {
  try {
    const { userId, userRole } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing userId" 
      });
    }

    const db = getDB();
    const notifications = db.collection("notifications");
    const notificationReads = db.collection("notification_reads");

    // Build query for notifications visible to this user
    let query = {
      $or: [
        { isGeneral: true },
        { userId: new ObjectId(userId) },
      ]
    };

    if (userRole === 'student') {
      query.$or.push({ targetRole: 'student' });
    } else if (userRole === 'professor') {
      query.$or.push({ targetRole: 'professor' });
    }

    const allNotifications = await notifications
      .find(query)
      .toArray();

    // Get read status for these notifications
    const readStatuses = await notificationReads
      .find({
        userId: new ObjectId(userId),
        notificationId: { $in: allNotifications.map(n => n._id) }
      })
      .toArray();

    const readNotificationIds = new Set(readStatuses.map(rs => rs.notificationId.toString()));

    // Count unread notifications
    const unreadCount = allNotifications.filter(notification => 
      !readNotificationIds.has(notification._id.toString())
    ).length;

    console.log(`🔔 User ${userId} has ${unreadCount} unread notifications`);
    
    res.json({ 
      success: true, 
      unreadCount 
    });

  } catch (error) {
    console.error("❌ Error getting unread notification count:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🧩 Add new notification with email AND SMS (WITH PREFERENCE CHECKING)
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
      sendEmail = true,
      sendSMS: shouldSendSMS = false, // Renamed parameter to avoid conflict
      phoneNumber = null
    } = req.body;

    const newNotification = {
      title,
      message,
      type,
      isGeneral,
      targetRole,
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

    const notificationResults = {
      emailSent: false,
      smsSent: false,
      preferencesChecked: false
    };

    // Determine which user to check preferences for
    let targetUserId = null;
    if (studentId) targetUserId = studentId;
    else if (professorId) targetUserId = professorId;

    // Get user notification preferences if we have a target user
    let userPreferences = null;
    if (targetUserId) {
      userPreferences = await getUserNotificationPreferences(targetUserId);
      notificationResults.preferencesChecked = true;
      console.log(`🔔 User preferences: ${JSON.stringify(userPreferences)}`);
    }

    // 📧 Send email notification if enabled and user preferences allow it
    const shouldSendEmail = sendEmail && 
      (!targetUserId || (userPreferences.enabled && userPreferences.channels.email));
    
    if (shouldSendEmail) {
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
        notificationResults.emailSent = true;
        console.log('✅ Email notification sent');
      } catch (emailError) {
        console.error("❌ Error sending notification email:", emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log('📧 Email skipped - user preference or setting disabled');
    }

    // 📱 Send SMS notification if enabled, phone number provided, and user preferences allow it
    const canSendSMS = shouldSendSMS && phoneNumber && 
      (!targetUserId || (userPreferences.enabled && userPreferences.channels.sms));
    
    if (canSendSMS) {
      try {
        const smsMessage = `${title}: ${message}`;
        const smsResult = await sendSMS(phoneNumber, smsMessage);
        notificationResults.smsSent = true;
        notificationResults.smsKey = smsResult.firebase_key;
        console.log(`✅ SMS notification sent to ${phoneNumber}`);
      } catch (smsError) {
        console.error("❌ Error sending SMS notification:", smsError);
        // Don't fail the request if SMS fails
      }
    } else {
      console.log('📱 SMS skipped - no phone number, user preference, or setting disabled');
    }

    res.json({ 
      success: true, 
      data: result,
      ...notificationResults
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
      sendEmail = true,
      sendSMS: shouldSendSMS = false, // Renamed parameter to avoid conflict
      phoneNumber = null
    } = notificationData;

    const newNotification = {
      title,
      message,
      type,
      isGeneral,
      targetRole,
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
    
    const notificationResults = {
      emailSent: false,
      smsSent: false,
      preferencesChecked: false
    };
    
    // Determine which user to check preferences for
    let targetUserId = null;
    if (studentId) targetUserId = studentId;
    else if (professorId) targetUserId = professorId;

    // Get user notification preferences if we have a target user
    let userPreferences = null;
    if (targetUserId) {
      userPreferences = await getUserNotificationPreferences(targetUserId);
      notificationResults.preferencesChecked = true;
      console.log(`🔔 User preferences for ${targetUserId}:`, userPreferences);
    }

    // 📧 Send email notification if enabled and user preferences allow it
    const shouldSendEmail = sendEmail && 
      (!targetUserId || (userPreferences.enabled && userPreferences.channels.email));
    
    if (shouldSendEmail) {
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
        notificationResults.emailSent = true;
      } catch (emailError) {
        console.error("❌ Error sending notification email:", emailError);
      }
    } else {
      console.log('📧 Email skipped based on preferences or settings');
    }

    // 📱 Send SMS notification if enabled, phone number provided, and user preferences allow it
    const canSendSMS = shouldSendSMS && phoneNumber && 
      (!targetUserId || (userPreferences.enabled && userPreferences.channels.sms));
    
    if (canSendSMS) {
      try {
        const smsMessage = `${title}: ${message}`;
        const smsResult = await sendSMS(phoneNumber, smsMessage);
        notificationResults.smsSent = true;
        notificationResults.smsKey = smsResult.firebase_key;
        console.log(`✅ SMS sent to ${phoneNumber}`);
      } catch (smsError) {
        console.error("❌ Error sending SMS:", smsError);
      }
    } else {
      console.log('📱 SMS skipped based on preferences, settings, or missing phone number');
    }
    
    return { ...result, ...notificationResults };
  } catch (error) {
    console.error("❌ Error adding notification:", error);
    throw error;
  }
};

export const createInquiryStatusNotification = async (inquiryData) => {
  const { title, studentId, professorName, studentPhoneNumber, status, replyMessage } = inquiryData;
  
  // Get student's notification preferences
  const studentPreferences = await getUserNotificationPreferences(studentId);
  console.log(`🔔 Student ${studentId} preferences:`, studentPreferences);

  let notificationTitle, notificationMessage, emailSubject, emailContent;

  // Set notification content based on status
  switch (status) {
    case 'accepted':
      notificationTitle = `Inquiry Accepted: ${title}`;
      notificationMessage = `Your inquiry has been accepted by Professor ${professorName}`;
      emailSubject = `Inquiry Accepted: ${title}`;
      emailContent = `
        <p>Dear Student,</p>
        <p>Your inquiry "<strong>${title}</strong>" has been <strong>accepted</strong> by Professor ${professorName}.</p>
        <p>The professor will address your concern accordingly.</p>
        <p>Thank you for using our inquiry system.</p>
      `;
      break;

    case 'resolved':
      notificationTitle = `Inquiry Resolved: ${title}`;
      notificationMessage = `Your inquiry has been resolved by Professor ${professorName}`;
      emailSubject = `Inquiry Resolved: ${title}`;
      emailContent = `
        <p>Dear Student,</p>
        <p>Your inquiry "<strong>${title}</strong>" has been <strong>resolved</strong> by Professor ${professorName}.</p>
        <p>The matter has been addressed and closed.</p>
        <p>Thank you for using our inquiry system.</p>
      `;
      break;

    case 'declined':
      notificationTitle = `Inquiry Response: ${title}`;
      notificationMessage = `Professor ${professorName} has responded to your inquiry`;
      emailSubject = `Response to Your Inquiry: ${title}`;
      emailContent = `
        <p>Dear Student,</p>
        <p>Professor ${professorName} has responded to your inquiry "<strong>${title}</strong>".</p>
        ${replyMessage ? `
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; margin: 15px 0;">
          <p style="margin: 0; font-style: italic;"><strong>Professor's Response:</strong></p>
          <p style="margin: 10px 0 0 0;">${replyMessage}</p>
        </div>
        ` : '<p>Please check the inquiry system for the professor\'s response.</p>'}
        <p>Thank you for using our inquiry system.</p>
      `;
      break;

    case 'replied':
      notificationTitle = `Inquiry Response: ${title}`;
      notificationMessage = `Professor ${professorName} has replied to your inquiry`;
      emailSubject = `Reply to Your Inquiry: ${title}`;
      emailContent = `
        <p>Dear Student,</p>
        <p>Professor ${professorName} has replied to your inquiry "<strong>${title}</strong>".</p>
        ${replyMessage ? `
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
          <p style="margin: 0; font-style: italic;"><strong>Professor's Reply:</strong></p>
          <p style="margin: 10px 0 0 0;">${replyMessage}</p>
        </div>
        ` : '<p>Please check the inquiry system for the professor\'s reply.</p>'}
        <p>Thank you for using our inquiry system.</p>
      `;
      break;

    case 'in_progress':
      notificationTitle = `Inquiry In Progress: ${title}`;
      notificationMessage = `Your inquiry is now being processed by Professor ${professorName}`;
      emailSubject = `Inquiry In Progress: ${title}`;
      emailContent = `
        <p>Dear Student,</p>
        <p>Your inquiry "<strong>${title}</strong>" is now <strong>in progress</strong> and is being reviewed by Professor ${professorName}.</p>
        <p>You will be notified once there are updates.</p>
        <p>Thank you for your patience.</p>
      `;
      break;

    default:
      notificationTitle = `Inquiry Update: ${title}`;
      notificationMessage = `Your inquiry status has been updated by Professor ${professorName}`;
      emailSubject = `Inquiry Status Updated: ${title}`;
      emailContent = `
        <p>Dear Student,</p>
        <p>The status of your inquiry "<strong>${title}</strong>" has been updated to <strong>${status}</strong> by Professor ${professorName}.</p>
        <p>Please check the inquiry system for more details.</p>
        <p>Thank you for using our inquiry system.</p>
      `;
  }

  // Create notification in database
  const notification = await createNotification({
    title: notificationTitle,
    message: notificationMessage,
    type: 'inquiry_status_update',
    studentId: studentId,
    sendEmail: studentPreferences.enabled && studentPreferences.channels.email,
    sendSMS: studentPreferences.enabled && studentPreferences.channels.sms,
    phoneNumber: studentPhoneNumber
  });
  
  return notification;
};

// Specialized functions for common use cases - UPDATED WITH PREFERENCE CHECKING
export const createStudentInquiryNotification = async (inquiryData) => {
  const { title, message, studentId, professorId, studentName, professorPhoneNumber } = inquiryData;
  
  // Get professor's notification preferences
  const professorPreferences = await getUserNotificationPreferences(professorId);
  console.log(`🔔 Professor ${professorId} preferences:`, professorPreferences);

  // Create notification in database
  const notification = await createNotification({
    title: `New Inquiry: ${title}`,
    message: `You have a new inquiry from ${studentName}`,
    type: 'inquiry',
    professorId: professorId,
    sendEmail: professorPreferences.enabled && professorPreferences.channels.email,
    sendSMS: professorPreferences.enabled && professorPreferences.channels.sms,
    phoneNumber: professorPhoneNumber
  });

  // Send specific inquiry email to professor (if preferences allow)
  if (professorPreferences.enabled && professorPreferences.channels.email) {
    await sendInquiryEmailToProfessor(inquiryData, professorId);
  }
  
  return notification;
};

export const createInquiryResolvedNotification = async (inquiryData) => {
  const { title, studentId, professorName, studentPhoneNumber } = inquiryData;
  
  // Get student's notification preferences
  const studentPreferences = await getUserNotificationPreferences(studentId);
  console.log(`🔔 Student ${studentId} preferences:`, studentPreferences);

  // Create notification in database
  const notification = await createNotification({
    title: `Inquiry Resolved: ${title}`,
    message: `Your inquiry has been resolved by Professor ${professorName}`,
    type: 'inquiry',
    studentId: studentId,
    sendEmail: studentPreferences.enabled && studentPreferences.channels.email,
    sendSMS: studentPreferences.enabled && studentPreferences.channels.sms,
    phoneNumber: studentPhoneNumber
  });

  // Send resolution email to student (if preferences allow)
  if (studentPreferences.enabled && studentPreferences.channels.email) {
    await sendInquiryResolvedEmailToStudent(inquiryData, studentId);
  }
  
  return notification;
};

// NEW: Create notification with SMS only (WITH PREFERENCE CHECKING)
export const createSMSNotification = async (notificationData) => {
  try {
    const db = getDB();
    const notifications = db.collection("notifications");

    const {
      title,
      message,
      type = 'sms',
      studentId,
      professorId,
      isGeneral = false,
      targetRole = null,
      phoneNumber // Required for SMS
    } = notificationData;

    if (!phoneNumber) {
      throw new Error("Phone number is required for SMS notifications");
    }

    const newNotification = {
      title,
      message,
      type,
      isGeneral,
      targetRole,
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
      }
    }

    // 🧩 Insert into DB
    const result = await notifications.insertOne(newNotification);
    console.log('✅ SMS Notification created:', result.insertedId);
    
    // Determine which user to check preferences for
    let targetUserId = null;
    if (studentId) targetUserId = studentId;
    else if (professorId) targetUserId = professorId;

    // Get user notification preferences if we have a target user
    let userPreferences = null;
    if (targetUserId) {
      userPreferences = await getUserNotificationPreferences(targetUserId);
      console.log(`🔔 User preferences for SMS:`, userPreferences);
    }

    // Check if SMS is allowed by user preferences
    const shouldSendSMS = !targetUserId || (userPreferences.enabled && userPreferences.channels.sms);
    
    if (shouldSendSMS) {
      // 📱 Send SMS
      const smsMessage = `${title}: ${message}`;
      const smsResult = await sendSMS(phoneNumber, smsMessage);
      
      console.log(`✅ SMS sent to ${phoneNumber}`);
      
      return {
        ...result,
        smsSent: true,
        smsKey: smsResult.firebase_key,
        preferencesChecked: !!targetUserId
      };
    } else {
      console.log(`📱 SMS skipped - user preferences disabled SMS`);
      return {
        ...result,
        smsSent: false,
        preferencesChecked: true,
        reason: "User preferences disabled SMS"
      };
    }
  } catch (error) {
    console.error("❌ Error creating SMS notification:", error);
    throw error;
  }
};

// NEW: Emergency/Urgent notification with both email and SMS (WITH PREFERENCE CHECKING)
export const createUrgentNotification = async (notificationData) => {
  const {
    title,
    message,
    type = 'urgent',
    studentId,
    professorId,
    isGeneral = false,
    targetRole = null,
    phoneNumber
  } = notificationData;

  // Determine which user to check preferences for
  let targetUserId = null;
  if (studentId) targetUserId = studentId;
  else if (professorId) targetUserId = professorId;

  // Get user notification preferences if we have a target user
  let userPreferences = null;
  if (targetUserId) {
    userPreferences = await getUserNotificationPreferences(targetUserId);
    console.log(`🔔 User preferences for urgent notification:`, userPreferences);
  }

  // Create notification with both email and SMS (respecting preferences)
  const notification = await createNotification({
    title: `🚨 ${title}`,
    message: message,
    type: type,
    studentId: studentId,
    professorId: professorId,
    isGeneral: isGeneral,
    targetRole: targetRole,
    sendEmail: !targetUserId || (userPreferences.enabled && userPreferences.channels.email),
    sendSMS: phoneNumber && (!targetUserId || (userPreferences.enabled && userPreferences.channels.sms)),
    phoneNumber: phoneNumber
  });

  console.log(`🚨 Urgent notification created and sent (respecting preferences)`);
  
  return notification;
};

// 🗑️ Clear all notifications for a user (mark all as read) - UPDATED
export const clearAllNotifications = async (req, res) => {
  try {
    const { userId, userRole } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing userId" 
      });
    }

    // Use the markAllAsRead function to clear notifications
    const db = getDB();
    const notifications = db.collection("notifications");
    const notificationReads = db.collection("notification_reads");

    // Get all unread notifications for this user
    const query = {
      $or: [
        { isGeneral: true },
        { userId: new ObjectId(userId) },
      ]
    };

    if (userRole === 'student') {
      query.$or.push({ targetRole: 'student' });
    } else if (userRole === 'professor') {
      query.$or.push({ targetRole: 'professor' });
    }

    const userNotifications = await notifications
      .find(query)
      .toArray();

    // Get already read notifications to avoid duplicates
    const existingReads = await notificationReads
      .find({ userId: new ObjectId(userId) })
      .toArray();

    const existingReadIds = new Set(existingReads.map(er => er.notificationId.toString()));

    // Create read records for all unread notifications
    const readRecords = userNotifications
      .filter(notification => !existingReadIds.has(notification._id.toString()))
      .map(notification => ({
        userId: new ObjectId(userId),
        notificationId: notification._id,
        readAt: new Date(),
        clearedAt: new Date()
      }));

    // Bulk insert all read records
    if (readRecords.length > 0) {
      await notificationReads.insertMany(readRecords);
    }

    console.log(`🗑️ Cleared ${readRecords.length} notifications for user ${userId}`);
    
    res.json({ 
      success: true, 
      message: `${readRecords.length} notifications cleared`,
      clearedCount: readRecords.length
    });

  } catch (error) {
    console.error("❌ Error clearing notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🎯 Mark multiple notifications as read - UPDATED
export const markMultipleNotificationsAsRead = async (req, res) => {
  try {
    const { userId, notificationIds } = req.body;

    if (!userId || !notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing userId or notificationIds array" 
      });
    }

    const db = getDB();
    const notifications = db.collection("notifications");
    const notificationReads = db.collection("notification_reads");

    // Convert string IDs to ObjectId
    const objectIds = notificationIds.map(id => new ObjectId(id));

    // Verify these notifications exist and user has access to them
    const userNotifications = await notifications
      .find({
        _id: { $in: objectIds },
        $or: [
          { studentId: new ObjectId(userId) },
          { professorId: new ObjectId(userId) },
          { userId: new ObjectId(userId) },
          { isGeneral: true },
          { targetRole: { $exists: true } }
        ]
      })
      .toArray();

    const accessibleNotificationIds = userNotifications.map(n => n._id);

    // Create read records for all accessible notifications
    const readRecords = accessibleNotificationIds.map(notificationId => ({
      userId: new ObjectId(userId),
      notificationId: notificationId,
      readAt: new Date()
    }));

    // Bulk insert using upsert to avoid duplicates
    if (readRecords.length > 0) {
      const bulkOps = readRecords.map(record => ({
        updateOne: {
          filter: {
            userId: record.userId,
            notificationId: record.notificationId
          },
          update: { $set: record },
          upsert: true
        }
      }));

      await notificationReads.bulkWrite(bulkOps);
    }

    console.log(`✅ ${readRecords.length} notifications marked as read by user ${userId}`);
    
    res.json({ 
      success: true, 
      message: `${readRecords.length} notifications marked as read`,
      markedCount: readRecords.length
    });

  } catch (error) {
    console.error("❌ Error marking multiple notifications as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📋 Get notifications with user-specific read status (legacy support)
export const getStudentNotifications = async (req, res) => {
  try {
    const { userId, userRole } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    // Use the new getAllNotifications function for consistency
    const db = getDB();
    const notifications = db.collection("notifications");
    const notificationReads = db.collection("notification_reads");

    let query = {
      $or: [
        { isGeneral: true },
        { userId: new ObjectId(userId) },
      ]
    };

    if (userRole === 'student') {
      query.$or.push({ targetRole: 'student' });
    } else if (userRole === 'professor') {
      query.$or.push({ targetRole: 'professor' });
    }

    const allNotifications = await notifications
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Get read status for these notifications
    const readStatuses = await notificationReads
      .find({
        userId: new ObjectId(userId),
        notificationId: { $in: allNotifications.map(n => n._id) }
      })
      .toArray();

    const readStatusMap = new Map();
    readStatuses.forEach(rs => {
      readStatusMap.set(rs.notificationId.toString(), true);
    });

    // Add read status to each notification for backward compatibility
    const notificationsWithReadStatus = allNotifications.map(notification => ({
      ...notification,
      read: readStatusMap.has(notification._id.toString())
    }));

    console.log(`📢 Fetched ${notificationsWithReadStatus.length} notifications for ${userRole} user: ${userId}`);

    res.json({ success: true, data: notificationsWithReadStatus });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

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