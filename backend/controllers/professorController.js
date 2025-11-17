import { getDB } from "../db.js";
import { ObjectId } from "mongodb";
import { createNotification, createStudentInquiryNotification, createInquiryResolvedNotification } from './notificationController.js';

export const getStatistics = async (req, res) => {
  try {
    const { professorId } = req.query;

    if (!professorId) {
      return res.status(400).json({ success: false, message: "Missing professorId" });
    }

    const db = getDB();
    const inquiries = db.collection("inquiries");

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Get today's inquiries count
    const todayCount = await inquiries.countDocuments({
      professorId: new ObjectId(professorId),
      createdAt: { $gte: startOfToday }
    });

    // Get this week's inquiries count
    const thisWeekCount = await inquiries.countDocuments({
      professorId: new ObjectId(professorId),
      createdAt: { $gte: startOfWeek }
    });

    // Get resolved inquiries count
    const resolvedCount = await inquiries.countDocuments({
      professorId: new ObjectId(professorId),
      status: "resolved"
    });

    const statistics = {
      today: todayCount,
      thisWeek: thisWeekCount,
      resolved: resolvedCount
    };

    res.json({ success: true, data: statistics });
  } catch (error) {
    console.error("❌ Error fetching statistics:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

  // 🎯 Get professor status by ID
export const getProfessorStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing professor ID" 
      });
    }

    const db = getDB();
    const users = db.collection("users");

    const professor = await users.findOne({ 
      _id: new ObjectId(id),
      role: 'professor'
    });

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: "Professor not found"
      });
    }

    res.json({
      success: true,
      data: {
        status: professor.status || 'NOT_AVAILABLE',
        lastStatusChange: professor.lastStatusChange
      }
    });

  } catch (error) {
    console.error("❌ Error fetching professor status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const getRecentConcerns = async (req, res) => {
  try {
    const { professorId } = req.query;

    if (!professorId) {
      return res.status(400).json({ success: false, message: "Missing professorId" });
    }

    const db = getDB();
    const inquiries = db.collection("inquiries");
    const users = db.collection("users");

    // Get recent inquiries with student details
    const recentInquiries = await inquiries
      .find({
        professorId: new ObjectId(professorId)
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Enrich inquiries with student information
    const enrichedInquiries = await Promise.all(
      recentInquiries.map(async (inquiry) => {
        const student = await users.findOne({
          _id: new ObjectId(inquiry.studentId),
          role: "student"
        });

        return {
          id: inquiry._id,
          name: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          subject: inquiry.subject,
          message: inquiry.message,
          initials: student ? 
            `${student.firstName?.charAt(0) || ''}${student.lastName?.charAt(0) || ''}`.toUpperCase() : 
            'US',
          email: student?.emailAddress || '',
          status: inquiry.status || 'pending',
          createdAt: inquiry.createdAt,
          updatedAt: inquiry.updatedAt
        };
      })
    );

    res.json({ success: true, data: enrichedInquiries });
  } catch (error) {
    console.error("❌ Error fetching recent concerns:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllConcerns = async (req, res) => {
  try {
    const { professorId, page = 1, limit = 10, status } = req.query;

    if (!professorId) {
      return res.status(400).json({ success: false, message: "Missing professorId" });
    }

    const db = getDB();
    const inquiries = db.collection("inquiries");
    const users = db.collection("users");

    // Build query filter
    const filter = { professorId: new ObjectId(professorId) };
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get paginated inquiries
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [inquiriesList, totalCount] = await Promise.all([
      inquiries
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      inquiries.countDocuments(filter)
    ]);

    // Enrich inquiries with student information
    const enrichedInquiries = await Promise.all(
      inquiriesList.map(async (inquiry) => {
        const student = await users.findOne({
          _id: new ObjectId(inquiry.studentId),
          role: "student"
        });

        return {
          id: inquiry._id,
          name: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          subject: inquiry.subject,
          message: inquiry.message,
          initials: student ? 
            `${student.firstName?.charAt(0) || ''}${student.lastName?.charAt(0) || ''}`.toUpperCase() : 
            'US',
          email: student?.emailAddress || '',
          status: inquiry.status || 'pending',
          createdAt: inquiry.createdAt,
          updatedAt: inquiry.updatedAt,
          studentId: inquiry.studentId
        };
      })
    );

    res.json({
      success: true,
      data: {
        inquiries: enrichedInquiries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error("❌ Error fetching all concerns:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateConcernStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, professorId } = req.body;

    if (!professorId) {
      return res.status(400).json({ success: false, message: "Missing professorId" });
    }

    const db = getDB();
    const inquiries = db.collection("inquiries");
    const users = db.collection("users");

    // Verify the inquiry belongs to this professor and get student info
    const inquiry = await inquiries.findOne({
      _id: new ObjectId(id),
      professorId: new ObjectId(professorId)
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    // Get professor and student details for notification
    const professor = await users.findOne({ _id: new ObjectId(professorId) });
    const student = await users.findOne({ _id: inquiry.studentId });

    if (!professor || !student) {
      return res.status(404).json({ success: false, message: "Professor or student not found" });
    }

    // Update the status
    const result = await inquiries.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ success: false, message: "Failed to update inquiry status" });
    }

    // 🎯 CREATE NOTIFICATION AND SEND EMAIL BASED ON STATUS
    try {
      let statusMessage;
      let notificationTitle;
      
      switch (status) {
        case 'resolved':
          statusMessage = 'has been resolved';
          notificationTitle = 'Inquiry Resolved';
          
          // Send specific resolved notification with email
          await createInquiryResolvedNotification({
            title: inquiry.subject,
            studentId: inquiry.studentId.toString(),
            professorName: `${professor.firstName} ${professor.lastName}`
          });
          break;
          
        case 'in_progress':
          statusMessage = 'is now in progress';
          notificationTitle = 'Inquiry In Progress';
          
          await createNotification({
            title: notificationTitle,
            message: `Your inquiry "${inquiry.subject}" ${statusMessage} by Prof. ${professor.lastName}`,
            type: 'inquiry_status_update',
            studentId: inquiry.studentId.toString(),
            sendEmail: true
          });
          break;
          
        case 'rejected':
          statusMessage = 'has been reviewed and requires more information';
          notificationTitle = 'Inquiry Update';
          
          await createNotification({
            title: notificationTitle,
            message: `Your inquiry "${inquiry.subject}" ${statusMessage} by Prof. ${professor.lastName}. Please provide additional details.`,
            type: 'inquiry_status_update',
            studentId: inquiry.studentId.toString(),
            sendEmail: true
          });
          break;
          
        default:
          statusMessage = `has been updated to ${status}`;
          notificationTitle = 'Inquiry Status Updated';
          
          await createNotification({
            title: notificationTitle,
            message: `Your inquiry "${inquiry.subject}" ${statusMessage} by Prof. ${professor.lastName}`,
            type: 'inquiry_status_update',
            studentId: inquiry.studentId.toString(),
            sendEmail: true
          });
      }

      console.log(`📢 Status update notification and email sent to student: ${student.firstName} ${student.lastName}`);
    } catch (notifError) {
      console.error('❌ Error creating status update notification/email:', notifError);
      // Don't fail the main request if notification/email fails
    }

    console.log(`✅ Inquiry ${id} status updated to ${status} by Prof. ${professor.lastName}`);

    res.json({ 
      success: true, 
      message: "Inquiry status updated successfully", 
      data: { 
        status,
        studentName: `${student.firstName} ${student.lastName}`,
        professorName: `${professor.firstName} ${professor.lastName}`,
        inquirySubject: inquiry.subject
      } 
    });
  } catch (error) {
    console.error("❌ Error updating concern status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const replyToConcern = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, professorId } = req.body;

    if (!professorId) {
      return res.status(400).json({ success: false, message: "Missing professorId" });
    }

    const db = getDB();
    const inquiries = db.collection("inquiries");

    // Verify the inquiry belongs to this professor
    const inquiry = await inquiries.findOne({
      _id: new ObjectId(id),
      professorId: new ObjectId(professorId)
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    // Add reply to the inquiry
    const reply = {
      message,
      repliedBy: new ObjectId(professorId),
      repliedAt: new Date()
    };

    const result = await inquiries.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: "replied",
          updatedAt: new Date()
        },
        $push: { replies: reply }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ success: false, message: "Failed to send reply" });
    }

    res.json({ success: true, message: "Reply sent successfully", data: { reply } });
  } catch (error) {
    console.error("❌ Error replying to concern:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getConcernDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { professorId } = req.query;

    if (!professorId) {
      return res.status(400).json({ success: false, message: "Missing professorId" });
    }

    const db = getDB();
    const inquiries = db.collection("inquiries");
    const users = db.collection("users");

    // Get inquiry with professor verification
    const inquiry = await inquiries.findOne({
      _id: new ObjectId(id),
      professorId: new ObjectId(professorId)
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    // Get student details
    const student = await users.findOne({
      _id: new ObjectId(inquiry.studentId),
      role: "student"
    });

    const enrichedInquiry = {
      id: inquiry._id,
      name: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
      subject: inquiry.subject,
      message: inquiry.message,
      initials: student ? 
        `${student.firstName?.charAt(0) || ''}${student.lastName?.charAt(0) || ''}`.toUpperCase() : 
        'US',
      email: student?.emailAddress || '',
      status: inquiry.status || 'pending',
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
      replies: inquiry.replies || [],
      studentId: inquiry.studentId
    };

    res.json({ success: true, data: enrichedInquiry });
  } catch (error) {
    console.error("❌ Error fetching concern detail:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfessorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, method = 'manual' } = req.body;

    console.log('Updating professor status manually for ID:', id, 'Status:', status, 'Method:', method);

    if (!id) {
      return res.status(400).json({ success: false, message: 'Professor ID is required' });
    }

    // ✅ FIX: Include 'busy' in valid statuses
    const validStatuses = ['available', 'busy', 'not-available', 'not_available'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid status is required (available, busy, not-available)' 
      });
    }

    const db = getDB('tap2find_db');
    const users = db.collection("users");
    const rfidLogs = db.collection("rfid_logs");
    const professorId = new ObjectId(String(id));

    // Get current professor to check previous status
    const professor = await users.findOne({ 
      _id: professorId,
      role: 'professor' 
    });

    if (!professor) {
      return res.status(404).json({ success: false, message: 'Professor not found' });
    }

    const currentStatus = professor.status || 'not-available';
    const timestamp = new Date();

    // ✅ FIX: Normalize all status values for database storage
    let dbStatus;
    if (status === 'not_available') {
      dbStatus = 'not-available';
    } else {
      dbStatus = status; // 'available' or 'busy'
    }

    // Update professor status
    const updateResult = await users.updateOne(
      { _id: professorId },
      { 
        $set: { 
          status: dbStatus,
          lastStatusChange: timestamp,
          lastUpdateMethod: method
        } 
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Professor not found' });
    }

    // Log the manual status change
    const statusLog = {
      uid: professor.idNumber || 'MANUAL',
      name: `${professor.firstName} ${professor.lastName}`,
      previousStatus: currentStatus,
      newStatus: dbStatus,
      timestamp: timestamp,
      receivedAt: new Date(),
      type: method === 'rfid_tap' ? 'professor_status_toggle' : 'professor_status_manual',
      method: method
    };

    await rfidLogs.insertOne(statusLog);

    // 🎯 CREATE NOTIFICATION FOR STUDENTS
    try {
      let statusText;
      if (dbStatus === 'available') {
        statusText = 'Available';
      } else if (dbStatus === 'busy') {
        statusText = 'Busy';
      } else {
        statusText = 'Not Available';
      }

      await createNotification({
        title: `Professor Status Updated`,
        message: `Prof. ${professor.lastName} is now ${statusText}`,
        type: 'professor_status',
        isGeneral: false,
        targetRole: 'student'
      });
      console.log(`📢 Notification sent to students about Prof. ${professor.lastName}'s status change`);
    } catch (notifError) {
      console.error('❌ Error creating notification:', notifError);
      // Don't fail the main request if notification fails
    }

    console.log(`✅ [MANUAL STATUS] ${professor.firstName} ${professor.lastName} changed from ${currentStatus} to ${dbStatus}`);

    // Get updated professor data
    const updatedProfessor = await users.findOne({ _id: professorId });

    // ✅ FIX: Update success message to include busy status
    let statusMessage;
    if (dbStatus === 'available') {
      statusMessage = 'available';
    } else if (dbStatus === 'busy') {
      statusMessage = 'busy';
    } else {
      statusMessage = 'not available';
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${statusMessage} successfully`,
      data: {
        professor: {
          id: updatedProfessor._id,
          firstName: updatedProfessor.firstName,
          lastName: updatedProfessor.lastName,
          emailAddress: updatedProfessor.emailAddress,
          status: updatedProfessor.status,
          lastStatusChange: updatedProfessor.lastStatusChange
        },
        action: 'status_updated_manual',
        timestamp: timestamp
      }
    });

  } catch (error) {
    console.error('Update professor status error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while updating status',
      error: error.message 
    });
  }
};

// 📊 Get Professor Activities
export const getProfessorActivities = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Getting activities for professor ID:', id);

    if (!id) {
      return res.status(400).json({ success: false, message: 'Professor ID is required' });
    }

    const db = getDB('tap2find_db');
    const rfidLogs = db.collection("rfid_logs");
    const professorId = new ObjectId(String(id));

    // Get professor data to find their RFID UID
    const professor = await db.collection("users").findOne({ 
      _id: professorId,
      role: 'professor' 
    });

    if (!professor) {
      return res.status(404).json({ success: false, message: 'Professor not found' });
    }

    const professorUid = professor.idNumber;

    // Get recent activities for this professor (both RFID and manual)
    const recentActivities = await rfidLogs
      .find({ 
        $or: [
          { uid: professorUid, type: { $in: ['professor_status_toggle', 'professor_status_manual'] } },
          { uid: 'MANUAL', name: `${professor.firstName} ${professor.lastName}` }
        ]
      })
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    // Format activities for frontend
    const formattedActivities = recentActivities.map(activity => ({
      id: activity._id,
      type: activity.type === 'professor_status_manual' ? 'status_change' : 'card_tap',
      title: activity.type === 'professor_status_manual' ? 'Status changed manually' : 'Card tapped',
      description: `from ${activity.previousStatus} to ${activity.newStatus}`,
      timestamp: activity.timestamp,
      method: activity.method || 'rfid'
    }));

    return res.status(200).json({
      success: true,
      activities: formattedActivities
    });
  } catch (error) {
    console.error('Get professor activities error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching activities',
      error: error.message 
    });
  }
};

//========================================================================================================

export const getAllProfessors = async (req, res) => {
  try {
    const db = getDB();

    const professors = await db.collection("users")
      .find({ role: "professor" })
      .project({
        firstName: 1,
        lastName: 1,
        department: 1,
        facultyPosition: 1,
        office: 1,
        status: 1,
        emailAddress: 1,
        isVerified: 1,
      })
      .toArray();

    // Check if it's weekend
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6; // 0 = Sunday, 6 = Saturday

    const formatted = professors.map(p => {
      // Determine availability status
      let availabilityStatus = "not-available";
      
      if (!isWeekend) {
        // On weekdays, use the professor's actual status
        if (p.status && p.isVerified !== false) {
          availabilityStatus = p.status.toLowerCase();
        } else {
          availabilityStatus = "not-available";
        }
      } else {
        // On weekends, always mark as not available
        availabilityStatus = "not-available";
      }

      return {
        id: p._id.toString(),
        name: `${p.firstName} ${p.lastName}`,
        department: p.department || "Unknown Department",
        office: p.office || "No office assigned",
        email: p.emailAddress,
        available: availabilityStatus,
        isWeekend: isWeekend // Optional: include weekend info for frontend
      };
    });

    res.status(200).json({ 
      success: true, 
      professors: formatted,
      isWeekend: isWeekend, // Include weekend status in response
      currentDay: now.toLocaleDateString('en-US', { weekday: 'long' })
    });

  } catch (error) {
    console.error("Error fetching professors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getProfessorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting professor profile for ID:', id);

    if (!id) {
      return res.status(400).json({ success: false, message: 'Professor ID is required' });
    }

    const db = getDB('tap2find_db');
    const users = db.collection('users');

    // Find professor in users collection by ID
    const professor = await users.findOne({ 
      _id: new ObjectId(String(id)),
      role: 'professor' 
    });

    if (!professor) {
      console.log('Professor not found with ID:', id);
      return res.status(404).json({ success: false, message: 'Professor not found' });
    }

    console.log('Professor found:', {
      id: professor._id,
      name: `${professor.firstName} ${professor.lastName}`,
      email: professor.emailAddress
    });

    return res.status(200).json({
      success: true,
      professor: {
        id: professor._id,
        firstName: professor.firstName || '',
        middleName: professor.middleName || '',
        lastName: professor.lastName || '',
        birthdate: professor.birthdate || '',
        address: professor.address || '',
        position: professor.position || '',
        postGraduate: professor.postGraduate || '',
        subjectHandles: professor.subjectHandles || '',
        contactNumber: professor.contactNumber || '',
        emailAddress: professor.emailAddress || '',
        avatarUrl: professor.avatarUrl || '',
        coverUrl: professor.coverUrl || '',
        lastLogin: professor.lastLogin || '',
        lastLoginAgent: professor.lastLoginAgent || '',
        status: professor.status || 'not-available',
      },
    });
  } catch (error) {
    console.error('Get professor profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching profile',
      error: error.message 
    });
  }
};

export const getProfessorLastUpdate = async (req, res) => {
  try {
    const { uid } = req.params;
    console.log('Getting last update for professor UID:', uid);

    if (!uid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Professor UID is required' 
      });
    }

    const db = getDB('tap2find_db');
    const rfidLogs = db.collection('rfid_logs');

    // Find the most recent status update for this professor
    // Filter by UID and status-related types
    const lastUpdate = await rfidLogs.findOne(
      { 
        uid: uid.toUpperCase().trim(),
        type: { 
          $in: [
            'professor_status_toggle', 
            'professor_status_manual',
            'manual_status_update'
          ] 
        }
      },
      { 
        sort: { timestamp: -1 } // Get the most recent
      }
    );

    if (!lastUpdate) {
      console.log('No status updates found for professor UID:', uid);
      return res.status(200).json({
        success: true,
        message: 'No status updates found',
        data: null
      });
    }

    console.log('Last update found:', {
      uid: lastUpdate.uid,
      timestamp: lastUpdate.timestamp,
      method: lastUpdate.method,
      type: lastUpdate.type
    });

    return res.status(200).json({
      success: true,
      data: {
        uid: lastUpdate.uid,
        name: lastUpdate.name,
        previousStatus: lastUpdate.previousStatus,
        newStatus: lastUpdate.newStatus,
        timestamp: lastUpdate.timestamp,
        method: lastUpdate.method,
        type: lastUpdate.type
      }
    });

  } catch (error) {
    console.error('Get professor last update error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching last update',
      error: error.message 
    });
  }
};

// ✏️ Update Professor Profile by ID
export const updateProfessorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Updating professor profile for ID:', id);
    console.log('Request body:', req.body);

    if (!id) {
      return res.status(400).json({ success: false, message: 'Professor ID is required' });
    }

    const db = getDB('tap2find_db');
    const users = db.collection('users');
    const professorId = new ObjectId(String(id));

    // Define allowed fields for update
    const allowedFields = [
      'firstName', 'lastName', 'middleName', 'birthdate', 'address',
      'position', 'postGraduate', 'subjectHandles', 'contactNumber', 
      'emailAddress', 'avatarUrl', 'coverUrl'
    ];
    
    const updates = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field) && req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    console.log('Fields to update:', updates);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    // Update professor in users collection
    const result = await users.updateOne(
      { 
        _id: professorId,
        role: 'professor' 
      }, 
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Professor not found' });
    }

    // Get updated professor data
    const updatedProfessor = await users.findOne({ 
      _id: professorId,
      role: 'professor' 
    });

    if (!updatedProfessor) {
      return res.status(404).json({ success: false, message: 'Failed to fetch updated profile' });
    }

    console.log('Profile updated successfully for professor:', updatedProfessor.emailAddress);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      professor: {
        id: updatedProfessor._id,
        firstName: updatedProfessor.firstName || '',
        middleName: updatedProfessor.middleName || '',
        lastName: updatedProfessor.lastName || '',
        birthdate: updatedProfessor.birthdate || '',
        address: updatedProfessor.address || '',
        position: updatedProfessor.position || '',
        postGraduate: updatedProfessor.postGraduate || '',
        subjectHandles: updatedProfessor.subjectHandles || '',
        contactNumber: updatedProfessor.contactNumber || '',
        emailAddress: updatedProfessor.emailAddress || '',
        avatarUrl: updatedProfessor.avatarUrl || '',
        coverUrl: updatedProfessor.coverUrl || '',
        lastLogin: updatedProfessor.lastLogin || '',
        lastLoginAgent: updatedProfessor.lastLoginAgent || '',
      },
    });
  } catch (error) {
    console.error('Update professor profile error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while updating profile',
      error: error.message 
    });
  }
};

export const getProfessorStatusHistory = async (req, res) => {
  try {
    const { uid } = req.params;
    console.log('Getting status history for professor UID:', uid);

    if (!uid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Professor UID is required' 
      });
    }

    const db = getDB('tap2find_db');
    const rfidLogs = db.collection('rfid_logs');

    // Find all status-related logs for this professor
    const history = await rfidLogs.find(
      { 
        uid: uid.toUpperCase().trim(),
        type: { 
          $in: [
            'professor_status_toggle', 
            'professor_status_manual',
            'manual_status_update',
            'professor_status_manual'
          ] 
        }
      },
      { 
        sort: { timestamp: -1 }, // Get most recent first
        limit: 20 // Limit to last 20 records
      }
    ).toArray();

    console.log(`Found ${history.length} status history records for UID: ${uid}`);

    return res.status(200).json({
      success: true,
      data: history,
      count: history.length
    });

  } catch (error) {
    console.error('Get professor status history error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching status history',
      error: error.message 
    });
  }
};