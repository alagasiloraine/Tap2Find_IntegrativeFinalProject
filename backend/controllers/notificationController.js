import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

export const getStudentNotifications = async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ success: false, message: "Missing studentId" });
    }

    const db = getDB();
    const notifications = db.collection("notifications");

    // Fetch both general and user-specific notifications
    const data = await notifications
      .find({
        $or: [
          { isGeneral: true },
          { studentId: new ObjectId(studentId) },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🧩 Add new notification
export const addNotification = async (req, res) => {
  try {
    const db = getDB();
    const notifications = db.collection("notifications");

    const {
      title,
      message,
      type,
      studentId,
      professorId,
      isGeneral = false
    } = req.body;

    const newNotification = {
      title,
      message,
      type,
      isGeneral,
      read: false,
      createdAt: new Date(),
    };

    // 🎯 Assign notification target
    if (!isGeneral) {
      if (studentId) {
        newNotification.studentId = new ObjectId(studentId);
      } else if (professorId) {
        newNotification.professorId = new ObjectId(professorId);
      } else {
        return res.status(400).json({
          success: false,
          message: "Either studentId or professorId is required for non-general notifications."
        });
      }
    }

    // 🧩 Insert into DB
    const result = await notifications.insertOne(newNotification);

    res.json({ success: true, data: result });

  } catch (error) {
    console.error("❌ Error adding notification:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

