import { getDB } from "../../db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");
    const concerns = db.collection("concerns");
    const tapins = db.collection("tapins");

    // Today range
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [
      totalProfessors,
      totalStudents,
      totalConcerns,
      activeRFIDTapInsToday,
    ] = await Promise.all([
      users.countDocuments({ $expr: { $eq: [ { $toLower: { $trim: { input: "$role" } } }, "professor" ] } }),
      users.countDocuments({ $expr: { $eq: [ { $toLower: { $trim: { input: "$role" } } }, "student" ] } }),
      concerns.countDocuments(),
      tapins.countDocuments({
        $or: [
          { timestamp: { $gte: start, $lt: end } },
          { createdAt: { $gte: start, $lt: end } },
        ],
      }),
    ]);

    // Professor availability breakdown
    const availabilityAgg = await users.aggregate([
      { $match: { $expr: { $eq: [ { $toLower: { $trim: { input: "$role" } } }, "professor" ] } } },
      { $group: {
          _id: { $toLower: { $trim: { input: "$status" } } },
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const availabilityMap = availabilityAgg.reduce((acc, cur) => {
      const key = cur._id || "";
      if (key === "available") acc.available += cur.count;
      else if (key === "busy") acc.busy += cur.count;
      else if (key === "not available" || key === "not_available" || key === "not-available") acc.notAvailable += cur.count;
      return acc;
    }, { available: 0, busy: 0, notAvailable: 0 });

    return res.status(200).json({
      success: true,
      stats: {
        totalProfessors,
        totalStudents,
        totalConcerns,
        activeRFIDTapInsToday,
        professorAvailability: availabilityMap,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ success: false, message: "Error fetching dashboard stats" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const list = await users
      .find({ role: { $ne: "admin" } }, { projection: { password: 0, otp: 0, otpExpires: 0 } })
      .sort({ _id: -1 })
      .limit(100)
      .toArray();

    return res.status(200).json({ success: true, users: list });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};