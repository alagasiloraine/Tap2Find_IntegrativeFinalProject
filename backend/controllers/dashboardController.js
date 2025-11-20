// controllers/dashboardController.js
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const db = getDB();
    const schedulesColl = db.collection("professor_schedules");
    const usersColl = db.collection("users");

    // ✅ Get student ID from authentication or query
    const studentId = req.user?.id || req.query.studentId;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Missing student ID",
      });
    }

    // Get current day and time for real-time availability calculation
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentHour = now.getHours();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    // 1️⃣ Get all professors for real-time stats
    const professors = await usersColl.find(
      { 
        role: "professor" // Simplified query
      },
      { 
        projection: { 
          _id: 1, 
          firstName: 1, 
          lastName: 1, 
          isVerified: 1,
          status: 1
        } 
      }
    ).toArray();

    console.log('📊 Total professors found:', professors.length);
    console.log('👨‍🏫 Professor statuses:', professors.map(p => ({ 
      name: `${p.firstName} ${p.lastName}`, 
      status: p.status,
      isVerified: p.isVerified 
    })));

    // Get all professor schedules for availability calculation
    const professorSchedules = await schedulesColl.find({
      scheduleType: 'manual'
    }).toArray();

    // Initialize stats
    let overallStats = {
      available: 0,
      busy: 0,
      notAvailable: 0,
      total: professors.length
    };

    // Calculate real-time availability stats for CURRENT HOUR only
    if (isWeekend) {
      // Weekend - all professors not available
      overallStats = {
        available: 0,
        busy: 0,
        notAvailable: professors.length,
        total: professors.length
      };
    } else {
      // Weekday - calculate based on schedules and status for current hour only
      professors.forEach(professor => {
        const professorSchedule = professorSchedules.find(s => 
          s.professorId.toString() === professor._id.toString()
        );

        const professorStatus = professor.status?.toLowerCase() || 'not available';

        // If professor is not verified, mark as not available
        if (!professor.isVerified) {
          overallStats.notAvailable++;
          return;
        }

        const todaysSchedule = professorSchedule?.schedule?.filter(
          s => s.day === currentDay
        ) || [];

        // Check if professor has schedule at current hour
        const hasSchedule = todaysSchedule.some(schedule => 
          currentHour >= schedule.startTime && currentHour < schedule.endTime
        );

        if (professorStatus === 'not available') {
          overallStats.notAvailable++;
        } else if (hasSchedule) {
          overallStats.busy++;
        } else {
          if (professorStatus === 'available') {
            overallStats.available++;
          } else if (professorStatus === 'busy') {
            overallStats.busy++;
          } else {
            overallStats.notAvailable++;
          }
        }
      });
    }

    console.log('🎯 Final calculated stats:', overallStats);

    // 2️⃣ Create simple chart data (since we don't have professor_status_logs)
    // We'll create dummy data for the last 7 days or use current stats
    const chartData = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Use current stats for all days (or you can modify this logic)
      chartData.push({
        date: dateString,
        available: overallStats.available,
        busy: overallStats.busy,
        notAvailable: overallStats.notAvailable
      });
    }

    // 3️⃣ Fetch Student Inquiries
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
        stats: overallStats, // This now contains the real calculated stats
        chartData,
        inquiriesSentCount,
        recentInquiries,
        debug: { // Add debug info to help troubleshooting
          totalProfessors: professors.length,
          currentHour,
          currentDay,
          isWeekend,
          professorStatuses: professors.map(p => p.status)
        }
      },
    });
  } catch (error) {
    console.error("❌ Combined dashboard controller error:", error);
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

    // Get current Philippine time (UTC+8)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const phTime = new Date(utc + (8 * 3600000));
    
    const currentDay = phTime.toLocaleDateString('en-US', { weekday: 'long' });
    const currentHour = phTime.getHours();
    const currentMinute = phTime.getMinutes();
    const isWeekend = phTime.getDay() === 0 || phTime.getDay() === 6;

    // Get all professors
    const professors = await usersColl.find(
      { 
        role: "professor"
      },
      { 
        projection: { 
          _id: 1, 
          firstName: 1, 
          lastName: 1, 
          isVerified: 1,
          status: 1
        } 
      }
    ).toArray();

    // Get all professor schedules
    const professorSchedules = await schedulesColl.find({
      scheduleType: 'manual'
    }).toArray();

    // Initialize availability data for each hour (7 AM to 6 PM)
    const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 to 18 (6 PM)
    const availabilityData = {};

    hours.forEach(hour => {
      availabilityData[hour] = {
        available: 0,
        busy: 0,
        notAvailable: 0,
        total: professors.length
      };
    });

    // If it's weekend, all professors are not available
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

      // Get professor's current status
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
        const hasSchedule = todaysSchedule.some(schedule => {
          // Handle both number and string formats for startTime/endTime
          const startTime = typeof schedule.startTime === 'string' ? parseInt(schedule.startTime) : schedule.startTime;
          const endTime = typeof schedule.endTime === 'string' ? parseInt(schedule.endTime) : schedule.endTime;
          return hour >= startTime && hour < endTime;
        });

        // NEW LOGIC: Evaluate availability based on status AND schedule
        if (professorStatus === 'not available') {
          // Professor explicitly set as not available - override everything
          availabilityData[hour].notAvailable++;
        } else if (hasSchedule) {
          // Professor has scheduled class - always mark as busy regardless of status
          availabilityData[hour].busy++;
        } else {
          // No schedule at this hour - use professor's manual status
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
