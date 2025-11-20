import { getDB } from "../db.js";
import { ObjectId } from "mongodb";
import { 
  createNotification, 
  getUserNotificationPreferences,
  createSMSNotification,
  createUrgentNotification 
} from "./notificationController.js";

export const handleRfidTap = async (req, res) => {
  try {
    const { uid } = req.body;

    // Validate required field - only UID is required now
    if (!uid) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required field: uid" 
      });
    }

    const db = getDB();
    const users = db.collection("users");
    const rfidLogs = db.collection("rfid_logs");

    // Normalize UID
    const normalizedUid = uid.toUpperCase().trim();
    
    // Generate timestamp on the server side
    const timestamp = new Date();

    console.log(`🔔 Processing RFID: ${normalizedUid} at ${timestamp}`);

    // Check if this RFID is assigned to a professor (using idNumber field)
    const professor = await users.findOne({ 
      idNumber: normalizedUid,
      role: 'professor'
    });

    if (professor) {
      // 🎯 PROFESSOR FOUND - toggle status between "AVAILABLE" and "NOT_AVAILABLE"
      const currentStatus = professor.status || 'not-available';
      const newStatus = currentStatus === 'available' ? 'not-available' : 'available';
      
      // Update professor status
      await users.updateOne(
        { _id: professor._id },
        { 
          $set: { 
            status: newStatus,
            lastStatusChange: timestamp
          } 
        }
      );

      // Log the professor status change
      const statusLog = {
        uid: normalizedUid,
        name: `${professor.firstName} ${professor.lastName}`,
        previousStatus: currentStatus,
        newStatus: newStatus,
        timestamp: timestamp,
        receivedAt: new Date(),
        type: 'professor_status_toggle',
        method: 'rfid_tap'
      };

      await rfidLogs.insertOne(statusLog);

      // 🎯 CREATE NOTIFICATION FOR STUDENTS (WITH PREFERENCE CHECKING)
      try {
        const statusText = newStatus === 'available' ? 'Available' : 'Not Available';
        
        // Get all students to check their preferences
        const students = await users.find({ role: 'student' }).toArray();
        
        // Create notification for each student who has notifications enabled
        for (const student of students) {
          const studentPreferences = await getUserNotificationPreferences(student._id.toString());
          
          // Only send notification if student has notifications enabled
          if (studentPreferences.enabled) {
            await createNotification({
              title: `Professor Status Updated`,
              message: `Prof. ${professor.lastName} is now ${statusText}`,
              type: 'professor_status',
              studentId: student._id.toString(),
              sendEmail: studentPreferences.channels.email,
              sendSMS: studentPreferences.channels.sms && student.contactNumber, // Only SMS if phone exists
              phoneNumber: student.contactNumber
            });
          }
        }
        console.log(professor.lastName);
        console.log(`📢 Professor status notifications sent to students respecting preferences`);
      } catch (notifError) {
        console.error('❌ Error creating notification:', notifError);
        // Don't fail the main request if notification fails
      }

      // Log to console
      console.log(`✅ [PROFESSOR] ${professor.firstName} ${professor.lastName} (${normalizedUid}) changed from ${currentStatus} to ${newStatus}`);

      return res.status(200).json({
        success: true,
        message: `Professor ${professor.firstName} ${professor.lastName} is now ${newStatus === 'available' ? 'available' : 'not-available'}`,
        data: {
          userType: 'professor',
          professor: {
            id: professor._id,
            name: professor.firstName + ' ' + professor.lastName,
            status: newStatus,
            available: newStatus === 'available' // Keep available field for compatibility if needed
          },
          action: 'status_toggled'
        }
      });

    } else {
      // 🎯 NOT A PROFESSOR - check if it's any registered user (using idNumber field)
      const otherUser = await users.findOne({ idNumber: normalizedUid });
      
      if (otherUser) {
        // Regular user (student/staff) - just log the tap
        const userLog = {
          uid: normalizedUid,
          name: `${otherUser.firstName} ${otherUser.lastName}`,
          role: otherUser.role,
          timestamp: timestamp,
          receivedAt: new Date(),
          type: 'user_tap',
          action: 'logged_only'
        };

        await rfidLogs.insertOne(userLog);

        // 🎯 CREATE WELCOME NOTIFICATION FOR THE USER (WITH PREFERENCE CHECKING)
        try {
          const userPreferences = await getUserNotificationPreferences(otherUser._id.toString());
          
          if (userPreferences.enabled) {
            await createNotification({
              title: `RFID Tap Recorded`,
              message: `Your RFID card was tapped at ${timestamp.toLocaleTimeString()}`,
              type: 'rfid_tap',
              studentId: otherUser.role === 'student' ? otherUser._id.toString() : undefined,
              professorId: otherUser.role === 'professor' ? otherUser._id.toString() : undefined,
              userId: otherUser._id.toString(),
              sendEmail: userPreferences.channels.email,
              sendSMS: userPreferences.channels.sms && otherUser.contactNumber,
              phoneNumber: otherUser.contactNumber
            });
            console.log(`📢 Welcome notification sent to ${otherUser.firstName} ${otherUser.lastName}`);
          }
        } catch (notifError) {
          console.error('❌ Error creating welcome notification:', notifError);
          // Don't fail the main request if notification fails
        }

        console.log(`📝 [USER TAP] ${otherUser.firstName} ${otherUser.lastName} (${normalizedUid}) - ${otherUser.role}`);

        return res.status(200).json({
          success: true,
          message: `${otherUser.role} ${otherUser.firstName} ${otherUser.lastName} tap recorded`,
          data: {
            userType: otherUser.role,
            user: {
              id: otherUser._id,
              name: otherUser.firstName + ' ' + otherUser.lastName,
              role: otherUser.role
            },
            action: 'tap_logged'
          }
        });

      } else {
        // 🎯 UNKNOWN RFID - send to frontend via WebSocket
        console.log(`🔔 [UNKNOWN RFID] ${normalizedUid} detected - sending to frontend via WebSocket`);

        // Log the unknown RFID
        const unknownLog = {
          uid: normalizedUid,
          timestamp: timestamp,
          receivedAt: new Date(),
          type: 'unknown_rfid',
          processed: false
        };

        await rfidLogs.insertOne(unknownLog);

        // 🎯 CREATE ADMIN NOTIFICATION FOR UNKNOWN RFID (WITH PREFERENCE CHECKING)
        try {
          // Get all admin users to notify about unknown RFID
          const admins = await users.find({ role: 'admin' }).toArray();
          
          for (const admin of admins) {
            const adminPreferences = await getUserNotificationPreferences(admin._id.toString());
            
            if (adminPreferences.enabled) {
              await createNotification({
                title: `Unknown RFID Detected`,
                message: `RFID ${normalizedUid} needs assignment. Tap occurred at ${timestamp.toLocaleString()}`,
                type: 'system_alert',
                userId: admin._id.toString(),
                sendEmail: adminPreferences.channels.email,
                sendSMS: adminPreferences.channels.sms && admin.contactNumber,
                phoneNumber: admin.contactNumber
              });
            }
          }
          console.log(`📢 Admin notifications sent for unknown RFID ${normalizedUid}`);
        } catch (notifError) {
          console.error('❌ Error creating admin notification:', notifError);
          // Don't fail the main request if notification fails
        }

        // Broadcast to all connected WebSocket clients
        try {
          const rfidWebSocketServer = req.app.get('rfidWebSocketServer');
          if (rfidWebSocketServer) {
            const clientCount = rfidWebSocketServer.broadcastToClients({
              type: 'unknown_rfid',
              rfid: normalizedUid,
              timestamp: timestamp.toISOString(),
              message: 'New RFID detected - needs assignment'
            });
            console.log(`📢 WebSocket broadcast sent to ${clientCount} clients`);
          } else {
            console.log('❌ WebSocket server not available');
          }
        } catch (wsError) {
          console.error('❌ WebSocket broadcast error:', wsError);
        }

        return res.status(200).json({
          success: true,
          message: "Unknown RFID detected - needs assignment",
          data: {
            userType: 'unknown',
            rfid: normalizedUid,
            timestamp: timestamp.toISOString(),
            needsAssignment: true,
            frontendAction: 'show_assignment_modal'
          }
        });
      }
    }

  } catch (error) {
    console.error("❌ Error handling RFID tap:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const assignRfidToUser = async (req, res) => {
  try {
    const { rfid, userId, userRole } = req.body;

    if (!rfid || !userId || !userRole) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: rfid, userId, userRole"
      });
    }

    const db = getDB();
    const users = db.collection("users");
    const rfidLogs = db.collection("rfid_logs");

    // Check if RFID is already assigned to another user (using idNumber field)
    const existingUser = await users.findOne({ 
      idNumber: rfid.toUpperCase().trim() 
    });
    
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: `RFID already assigned to ${existingUser.firstName} ${existingUser.lastName}`
      });
    }

    // Get user details
    const userToAssign = await users.findOne({ _id: new ObjectId(userId) });
    if (!userToAssign) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update user with RFID (using idNumber field)
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          idNumber: rfid.toUpperCase().trim(),
          rfidAssignedAt: new Date(),
          available: userRole === 'professor' ? true : undefined // Default professors to available
        } 
      }
    );

    // Mark the RFID log as assigned
    await rfidLogs.updateMany(
      { 
        uid: rfid.toUpperCase().trim(),
        type: 'unknown_rfid'
      },
      { 
        $set: { 
          processed: true,
          assignedTo: userId,
          assignedAt: new Date(),
          assignedName: `${userToAssign.firstName} ${userToAssign.lastName}`
        } 
      }
    );

    console.log(`✅ [RFID ASSIGNED] ${rfid} assigned to ${userToAssign.firstName} ${userToAssign.lastName} (${userRole})`);

    res.json({
      success: true,
      message: `RFID successfully assigned to ${userToAssign.firstName} ${userToAssign.lastName}`
    });

  } catch (error) {
    console.error("❌ Error assigning RFID:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// 🎯 Get recent unknown RFIDs (for HTTP polling)
export const getRecentUnknownRfids = async (req, res) => {
  try {
    const db = getDB();
    const rfidLogs = db.collection("rfid_logs");
    
    // Get RFIDs from the last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    
    const unknownLogs = await rfidLogs
      .find({ 
        type: 'unknown_rfid',
        timestamp: { $gte: twoMinutesAgo }
      })
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();

    const recentRfids = unknownLogs.map(log => ({
      uid: log.uid,
      timestamp: log.timestamp
    }));

    res.json({
      success: true,
      data: recentRfids
    });

  } catch (error) {
    console.error("❌ Error fetching recent unknown RFIDs:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};