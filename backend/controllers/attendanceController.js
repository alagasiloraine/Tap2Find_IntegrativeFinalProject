import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

// 🎯 Create attendance record (used by ESP32)
export const createAttendance = async (req, res) => {
  try {
    const { uid, name, status, timestamp } = req.body;

    // Validate required fields
    if (!uid || !name || !status || !timestamp) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: uid, name, status, timestamp" 
      });
    }

    // Validate status
    const upperStatus = status.toUpperCase();
    if (!['IN', 'OUT'].includes(upperStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: "Status must be either 'IN' or 'OUT'" 
      });
    }

    // Parse and validate timestamp
    const recordTimestamp = new Date(timestamp);
    if (isNaN(recordTimestamp.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid timestamp format" 
      });
    }

    const db = getDB();
    const attendance = db.collection("attendance");

    // Create attendance record
    const record = {
      uid: uid.toUpperCase().trim(),
      name: name.trim(),
      status: upperStatus,
      timestamp: recordTimestamp,
      receivedAt: new Date()
    };

    // Insert into MongoDB
    const result = await attendance.insertOne(record);

    // Log the attendance
    console.log(`✅ [ATTENDANCE] ${record.name} (${record.uid}) ${record.status} at ${timestamp}`);

    res.status(201).json({
      success: true,
      message: "Attendance recorded successfully",
      data: {
        id: result.insertedId,
        ...record
      }
    });

  } catch (error) {
    console.error("❌ Error creating attendance record:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 Get all attendance records with filtering
export const getAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 50, uid, name, date, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const db = getDB();
    const attendance = db.collection("attendance");

    // Build query
    let query = {};
    
    if (uid) {
      query.uid = { $regex: uid.toUpperCase(), $options: 'i' };
    }
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.timestamp = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    if (status) {
      query.status = status.toUpperCase();
    }

    // Get total count
    const total = await attendance.countDocuments(query);

    // Get paginated results
    const data = await attendance
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .toArray();

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error("❌ Error fetching attendance records:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🎯 Get attendance records by UID
export const getAttendanceByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const { limit = 100 } = req.query;

    const db = getDB();
    const attendance = db.collection("attendance");

    const data = await attendance
      .find({ uid: uid.toUpperCase() })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .toArray();

    res.json({
      success: true,
      data,
      total: data.length
    });

  } catch (error) {
    console.error("❌ Error fetching attendance by UID:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// 🎯 Get today's attendance statistics
export const getTodayStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const db = getDB();
    const attendance = db.collection("attendance");

    // Get today's records
    const todayRecords = await attendance
      .find({
        timestamp: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      })
      .toArray();

    // Calculate statistics
    const data = {
      total: todayRecords.length,
      ins: todayRecords.filter(r => r.status === 'IN').length,
      outs: todayRecords.filter(r => r.status === 'OUT').length,
      uniqueUsers: [...new Set(todayRecords.map(r => r.uid))].length
    };

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("❌ Error fetching today stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// 🎯 Get statistics for date range
export const getStatsByRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate query parameters are required"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1); // Include the entire end date

    const db = getDB();
    const attendance = db.collection("attendance");

    const records = await attendance
      .find({
        timestamp: {
          $gte: start,
          $lt: end
        }
      })
      .toArray();

    const data = {
      total: records.length,
      ins: records.filter(r => r.status === 'IN').length,
      outs: records.filter(r => r.status === 'OUT').length,
      uniqueUsers: [...new Set(records.map(r => r.uid))].length,
      dateRange: {
        start: startDate,
        end: endDate
      }
    };

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error("❌ Error fetching range stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// 🎯 Get latest attendance records
export const getLatestAttendance = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const db = getDB();
    const attendance = db.collection("attendance");

    const data = await attendance
      .find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .toArray();

    res.json({
      success: true,
      data,
      total: data.length
    });

  } catch (error) {
    console.error("❌ Error fetching latest attendance:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// 🎯 Delete attendance record (admin only)
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Attendance ID is required"
      });
    }

    const db = getDB();
    const attendance = db.collection("attendance");

    const result = await attendance.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    res.json({
      success: true,
      message: "Attendance record deleted successfully"
    });

  } catch (error) {
    console.error("❌ Error deleting attendance record:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};