import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

// 🎯 Handle RFID tap from ESP32 (RFID UID only)
// export const handleRfidTap = async (req, res) => {
//   try {
//     const { uid } = req.body;

//     // Validate required field - only UID is required now
//     if (!uid) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Missing required field: uid" 
//       });
//     }

//     const db = getDB();
//     const users = db.collection("users");
//     const rfidLogs = db.collection("rfid_logs");

//     // Normalize UID
//     const normalizedUid = uid.toUpperCase().trim();
    
//     // Generate timestamp on the server side
//     const timestamp = new Date();

//     console.log(`🔔 Processing RFID: ${normalizedUid} at ${timestamp}`);

//     // Check if this RFID is assigned to a professor (using idNumber field)
//     const professor = await users.findOne({ 
//       idNumber: normalizedUid,
//       role: 'professor'
//     });

//     if (professor) {
//       // 🎯 PROFESSOR FOUND - toggle availability
//       const newAvailability = !professor.available;
      
//       // Update professor availability
//       await users.updateOne(
//         { _id: professor._id },
//         { 
//           $set: { 
//             available: newAvailability,
//             lastStatusChange: timestamp
//           } 
//         }
//       );

//       // Log the professor status change
//       const statusLog = {
//         uid: normalizedUid,
//         name: `${professor.firstName} ${professor.lastName}`,
//         previousStatus: professor.available ? 'available' : 'not available',
//         newStatus: newAvailability ? 'available' : 'not available',
//         timestamp: timestamp,
//         receivedAt: new Date(),
//         type: 'professor_availability_toggle'
//       };

//       await rfidLogs.insertOne(statusLog);

//       // Log to console
//       console.log(`✅ [PROFESSOR] ${professor.firstName} ${professor.lastName} (${normalizedUid}) changed from ${statusLog.previousStatus} to ${statusLog.newStatus}`);

//       return res.status(200).json({
//         success: true,
//         message: `Professor ${professor.firstName} ${professor.lastName} is now ${newAvailability ? 'available' : 'not available'}`,
//         data: {
//           userType: 'professor',
//           professor: {
//             id: professor._id,
//             name: professor.firstName + ' ' + professor.lastName,
//             available: newAvailability,
//             status: newAvailability ? 'AVAILABLE' : 'NOT_AVAILABLE'
//           },
//           action: 'availability_toggled'
//         }
//       });

//     } else {
//       // 🎯 NOT A PROFESSOR - check if it's any registered user (using idNumber field)
//       const otherUser = await users.findOne({ idNumber: normalizedUid });
      
//       if (otherUser) {
//         // Regular user (student/staff) - just log the tap
//         const userLog = {
//           uid: normalizedUid,
//           name: `${otherUser.firstName} ${otherUser.lastName}`,
//           role: otherUser.role,
//           timestamp: timestamp,
//           receivedAt: new Date(),
//           type: 'user_tap',
//           action: 'logged_only'
//         };

//         await rfidLogs.insertOne(userLog);

//         console.log(`📝 [USER TAP] ${otherUser.firstName} ${otherUser.lastName} (${normalizedUid}) - ${otherUser.role}`);

//         return res.status(200).json({
//           success: true,
//           message: `${otherUser.role} ${otherUser.firstName} ${otherUser.lastName} tap recorded`,
//           data: {
//             userType: otherUser.role,
//             user: {
//               id: otherUser._id,
//               name: otherUser.firstName + ' ' + otherUser.lastName,
//               role: otherUser.role
//             },
//             action: 'tap_logged'
//           }
//         });

//       } else {
//         // 🎯 UNKNOWN RFID - send to frontend via WebSocket
//         console.log(`🔔 [UNKNOWN RFID] ${normalizedUid} detected - sending to frontend via WebSocket`);

//         // Log the unknown RFID
//         const unknownLog = {
//           uid: normalizedUid,
//           timestamp: timestamp,
//           receivedAt: new Date(),
//           type: 'unknown_rfid',
//           processed: false
//         };

//         await rfidLogs.insertOne(unknownLog);

//         // Broadcast to all connected WebSocket clients
//         try {
//           const rfidWebSocketServer = req.app.get('rfidWebSocketServer');
//           if (rfidWebSocketServer) {
//             const clientCount = rfidWebSocketServer.broadcastToClients({
//               type: 'unknown_rfid',
//               rfid: normalizedUid,
//               timestamp: timestamp.toISOString(),
//               message: 'New RFID detected - needs assignment'
//             });
//             console.log(`📢 WebSocket broadcast sent to ${clientCount} clients`);
//           } else {
//             console.log('❌ WebSocket server not available');
//           }
//         } catch (wsError) {
//           console.error('❌ WebSocket broadcast error:', wsError);
//         }

//         return res.status(200).json({
//           success: true,
//           message: "Unknown RFID detected - needs assignment",
//           data: {
//             userType: 'unknown',
//             rfid: normalizedUid,
//             timestamp: timestamp.toISOString(),
//             needsAssignment: true,
//             frontendAction: 'show_assignment_modal'
//           }
//         });
//       }
//     }

//   } catch (error) {
//     console.error("❌ Error handling RFID tap:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

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
      const currentStatus = professor.status || 'not-vailable';
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
        type: 'professor_status_toggle'
      };

      await rfidLogs.insertOne(statusLog);

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

