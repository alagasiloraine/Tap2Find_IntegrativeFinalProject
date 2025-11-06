// controllers/dashboardController.js
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const db = getDB();

    // ✅ Get student ID from authentication or query
    const studentId = req.user?.id || req.query.studentId;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Missing student ID",
      });
    }

    // 1️⃣ Professor Status Statistics
    const professorStats = await db.collection("users")
      .aggregate([
        { $match: { role: "professor" } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray();

    const stats = {
      available: professorStats.find((s) => s._id === "Available")?.count || 0,
      busy: professorStats.find((s) => s._id === "Busy")?.count || 0,
      notAvailable: professorStats.find((s) => s._id === "Not Available")?.count || 0,
    };

    // 2️⃣ Professor Availability Trend Chart
    const availabilityTrend = await db.collection("professor_status_logs")
      .aggregate([
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ])
      .toArray();

    const groupedByDate = {};
    for (const entry of availabilityTrend) {
      const { date, status } = entry._id;
      if (!groupedByDate[date])
        groupedByDate[date] = { date, available: 0, busy: 0, notAvailable: 0 };

      if (status === "Available") groupedByDate[date].available += entry.count;
      else if (status === "Busy") groupedByDate[date].busy += entry.count;
      else if (status === "Not Available")
        groupedByDate[date].notAvailable += entry.count;
    }

    const chartData = Object.values(groupedByDate);

    // 3️⃣ Fetch Student Inquiries (and include professor details)
    const inquiries = await db.collection("inquiries")
      .find({
        $or: [
          { studentId: new ObjectId(studentId) },
          { studentId: studentId }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    const inquiriesWithProfessors = await Promise.all(
      inquiries.map(async (inquiry) => {
        try {
          const professor = await db.collection("users").findOne({
            _id: new ObjectId(inquiry.professorId),
            role: "professor",
          });

          return {
            id: inquiry._id,
            subject: inquiry.subject,
            message: inquiry.message,
            status: inquiry.status,
            createdAt: inquiry.createdAt,
            updatedAt: inquiry.updatedAt,
            professor: professor
              ? {
                  _id: professor._id,
                  name: `${professor.firstName || ""} ${professor.lastName || ""}`.trim(),
                  initials: `${professor.firstName?.charAt(0) || ""}${professor.lastName?.charAt(0) || ""}`.toUpperCase(),
                  email: professor.emailAddress,
                  department: professor.department,
                  facultyPosition: professor.facultyPosition,
                  office: professor.office,
                  status: professor.status || "Not Available",
                }
              : null,
          };
        } catch (err) {
          console.error(`⚠️ Error fetching professor ${inquiry.professorId}:`, err);
          return { ...inquiry, professor: null };
        }
      })
    );

    const inquiriesSentCount = inquiriesWithProfessors.length;
    const recentInquiries = inquiriesWithProfessors.slice(0, 5);

    // ✅ Final Response
    res.status(200).json({
      success: true,
      data: {
        stats,
        chartData,
        inquiriesSentCount,
        recentInquiries,
      },
    });
  } catch (error) {
    console.error("❌ Dashboard controller error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data.",
    });
  }
};

