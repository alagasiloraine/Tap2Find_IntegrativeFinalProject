import { getDB } from "../../db.js";

// Reports summary
export const getReportsSummary = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");
    const concerns = db.collection("concerns");

    const [professors, students, totalConcerns] = await Promise.all([
      users.countDocuments({ $expr: { $eq: [ { $toLower: { $trim: { input: "$role" } } }, "professor" ] } }),
      users.countDocuments({ $expr: { $eq: [ { $toLower: { $trim: { input: "$role" } } }, "student" ] } }),
      concerns.countDocuments(),
    ]);

    return res.status(200).json({ success: true, summary: { professors, students, totalConcerns } });
  } catch (err) {
    console.error("Error building report summary:", err);
    return res.status(500).json({ success: false, message: "Failed to build report summary" });
  }
};