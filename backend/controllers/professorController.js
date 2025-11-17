import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

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

      // Verify the inquiry belongs to this professor
      const inquiry = await inquiries.findOne({
        _id: new ObjectId(id),
        professorId: new ObjectId(professorId)
      });

      if (!inquiry) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
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

      res.json({ success: true, message: "Inquiry status updated successfully", data: { status } });
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