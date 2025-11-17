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

export const getProfessorAvailability = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const schedulesColl = db.collection("professor_schedules");
    const usersColl = db.collection("users");

    // Get current day and time
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }); // Monday, Tuesday, etc.
    const currentHour = now.getHours();
    
    // Check if it's weekend
    const isWeekend = now.getDay() === 0 || now.getDay() === 6; // 0 = Sunday, 6 = Saturday

    // Get all professors with their status
    const professors = await usersColl.find(
      { 
        $expr: { 
          $eq: [ 
            { $toLower: { $trim: { input: "$role" } } }, 
            "professor" 
          ] 
        } 
      },
      { 
        projection: { 
          _id: 1, 
          firstName: 1, 
          lastName: 1, 
          isVerified: 1,
          status: 1 // Include status field
        } 
      }
    ).toArray();

    // Get all professor schedules
    const professorSchedules = await schedulesColl.find({
      scheduleType: 'manual'
    }).toArray();

    // Initialize availability data for each hour (8 AM to 8 PM)
    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 to 20 (8 PM)
    const availabilityData = {};

    hours.forEach(hour => {
      availabilityData[hour] = {
        available: 0,
        busy: 0,
        notAvailable: 0,
        total: professors.length
      };
    });

    // If it's weekend, all professors are not available (regardless of status)
    if (isWeekend) {
      hours.forEach(hour => {
        availabilityData[hour] = {
          available: 0,
          busy: 0,
          notAvailable: professors.length,
          total: professors.length
        };
      });
      
      res.status(200).json({
        success: true,
        data: {
          hourlyData: availabilityData,
          overallStats: {
            available: 0,
            busy: 0,
            notAvailable: professors.length,
            total: professors.length
          },
          currentDay,
          currentHour,
          totalProfessors: professors.length,
          isWeekend: true
        }
      });
      return;
    }

    // Calculate availability for each professor (only on weekdays)
    professors.forEach(professor => {
      const professorSchedule = professorSchedules.find(s => 
        s.professorId.toString() === professor._id.toString()
      );

      // Get professor's current status (default to 'Not Available' if not set)
      const professorStatus = professor.status?.toLowerCase() || 'not available';

      // If professor is not verified, mark as not available for all hours
      if (!professor.isVerified) {
        hours.forEach(hour => {
          availabilityData[hour].notAvailable++;
        });
        return;
      }

      // Get today's schedule for this professor
      const todaysSchedule = professorSchedule?.schedule?.filter(
        s => s.day === currentDay
      ) || [];

      hours.forEach(hour => {
        // Check if professor has schedule at this hour
        const hasSchedule = todaysSchedule.some(schedule => 
          hour >= schedule.startTime && hour < schedule.endTime
        );

        // Determine availability based on both schedule and status
        if (professorStatus === 'not available') {
          // Professor explicitly set as not available - override everything
          availabilityData[hour].notAvailable++;
        } else if (hasSchedule) {
          // Professor has scheduled class
          if (professorStatus === 'busy') {
            // Professor is busy and has schedule - count as busy
            availabilityData[hour].busy++;
          } else if (professorStatus === 'available') {
            // Professor is available but has schedule - count as busy (teaching)
            availabilityData[hour].busy++;
          } else {
            // Default behavior for other statuses
            availabilityData[hour].busy++;
          }
        } else {
          // Professor has no schedule at this hour
          if (professorStatus === 'available') {
            // Professor is explicitly available and free - count as available
            availabilityData[hour].available++;
          } else if (professorStatus === 'busy') {
            // Professor is busy but no schedule - could be meetings, etc.
            availabilityData[hour].busy++;
          } else {
            // Default for other statuses or no status set
            availabilityData[hour].notAvailable++;
          }
        }
      });
    });

    // Calculate overall stats for current hour
    const overallStats = {
      available: availabilityData[currentHour]?.available || 0,
      busy: availabilityData[currentHour]?.busy || 0,
      notAvailable: availabilityData[currentHour]?.notAvailable || 0,
      total: professors.length
    };

    res.status(200).json({
      success: true,
      data: {
        hourlyData: availabilityData,
        overallStats,
        currentDay,
        currentHour,
        totalProfessors: professors.length,
        isWeekend: false
      }
    });

  } catch (err) {
    console.error("Error calculating professor availability:", err);
    return res.status(500).json({ success: false, message: "Failed to calculate availability" });
  }
};