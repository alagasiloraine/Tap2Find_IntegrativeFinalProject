import { getDB } from "../../db.js";
import { ObjectId } from "mongodb";

// Get daily concerns counts for last N days
export const getConcernsDailyCounts = async (req, res) => {
  try {
    const daysRaw = Number(req.query.days || 14);
    const days = Math.max(1, Math.min(365, isNaN(daysRaw) ? 14 : daysRaw));

    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");

    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const pipeline = [
      {
        $addFields: {
          _stamp: {
            $ifNull: [
              "$createdAt",
              { $ifNull: ["$timestamp", "$date"] }
            ]
          }
        }
      },
      { $match: { _stamp: { $gte: start, $lte: end } } },
      {
        $addFields: {
          _day: { $dateToString: { format: "%Y-%m-%d", date: "$_stamp" } }
        }
      },
      { $group: { _id: "$_day", count: { $sum: 1 } } },
      { $project: { _id: 0, day: "$_id", count: 1 } },
      { $sort: { day: 1 } }
    ];

    const agg = await concerns.aggregate(pipeline).toArray();

    // Build continuous series with zeros
    const series = [];
    const map = new Map(agg.map(r => [r.day, r.count]));
    const cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      series.push({ day: key, count: map.get(key) || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    const total = series.reduce((s, p) => s + p.count, 0);
    const max = series.reduce((m, p) => Math.max(m, p.count), 0);

    return res.status(200).json({
      success: true,
      days,
      from: start.toISOString(),
      to: end.toISOString(),
      daily: series,
      total,
      max,
    });
  } catch (err) {
    console.error("Error aggregating daily concerns:", err);
    return res.status(500).json({ success: false, message: "Failed to aggregate daily concerns" });
  }
};

// Get concerns list with optional filters
export const getConcerns = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");

    const { professorId, studentId, status } = req.query;
    const filter = {};
    if (professorId && ObjectId.isValid(professorId)) filter.professorId = new ObjectId(professorId);
    if (studentId && ObjectId.isValid(studentId)) filter.studentId = new ObjectId(studentId);
    if (status) filter.status = String(status);

    const list = await concerns
      .find(filter)
      .sort({ createdAt: -1, timestamp: -1, _id: -1 })
      .limit(100)
      .toArray();

    // Enrich with student/professor names
    const userIds = [];
    for (const c of list) {
      if (c.studentId) userIds.push(c.studentId);
      if (c.professorId) userIds.push(c.professorId);
    }
    const uniqStrings = [...new Set(userIds.map((x) => (x ? x.toString() : null)).filter(Boolean))];
    const uniq = uniqStrings.filter((s) => ObjectId.isValid(s)).map((s) => new ObjectId(s));
    if (uniq.length) {
      const users = await getDB("tap2find_db").collection("users")
        .find({ _id: { $in: uniq } }, { projection: { firstName: 1, lastName: 1, role: 1 } })
        .toArray();
      const map = new Map(users.map(u => [u._id.toString(), u]));
      for (const c of list) {
        const stu = c.studentId ? map.get(c.studentId.toString()) : null;
        const prof = c.professorId ? map.get(c.professorId.toString()) : null;
        if (stu) c.studentName = `${stu.firstName || ''} ${stu.lastName || ''}`.trim();
        if (prof) c.professorName = `${prof.firstName || ''} ${prof.lastName || ''}`.trim();
      }
    }

    return res.status(200).json({ success: true, concerns: list });
  } catch (err) {
    console.error("Error fetching concerns:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch concerns" });
  }
};

// Get a single concern by _id
export const getConcernById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");

    const doc = await concerns.findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ success: false, message: "Concern not found" });

    // Enrich with names
    const usersColl = getDB("tap2find_db").collection("users");
    // Handle both string and ObjectId forms safely
    let sid = null;
    if (doc.studentId) {
      sid = typeof doc.studentId === 'string' ? (ObjectId.isValid(doc.studentId) ? new ObjectId(doc.studentId) : null) : doc.studentId;
    }
    if (sid) {
      const stu = await usersColl.findOne({ _id: sid }, { projection: { firstName: 1, lastName: 1 } });
      if (stu) doc.studentName = `${stu.firstName || ''} ${stu.lastName || ''}`.trim();
    }

    let pid = null;
    if (doc.professorId) {
      pid = typeof doc.professorId === 'string' ? (ObjectId.isValid(doc.professorId) ? new ObjectId(doc.professorId) : null) : doc.professorId;
    }
    if (pid) {
      const prof = await usersColl.findOne({ _id: pid }, { projection: { firstName: 1, lastName: 1 } });
      if (prof) doc.professorName = `${prof.firstName || ''} ${prof.lastName || ''}`.trim();
    }

    return res.status(200).json({ success: true, concern: doc });
  } catch (err) {
    console.error("Error fetching concern:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch concern" });
  }
};

// Update concern status: allow only 'pending' or 'resolved'
export const updateConcernStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const allowed = ["pending", "resolved"];
    if (!allowed.includes(String(status))) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");
    const result = await concerns.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: String(status), updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Concern not found" });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating concern status:", err);
    return res.status(500).json({ success: false, message: "Failed to update concern status" });
  }
};

// Archive a concern (set status = 'archived')
export const archiveConcern = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");
    const result = await concerns.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "archived", updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Concern not found" });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error archiving concern:", err);
    return res.status(500).json({ success: false, message: "Failed to archive concern" });
  }
};

// Delete a concern
export const deleteConcern = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");
    const result = await concerns.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: "Concern not found" });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting concern:", err);
    return res.status(500).json({ success: false, message: "Failed to delete concern" });
  }
};