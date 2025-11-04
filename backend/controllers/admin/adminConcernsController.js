import { getDB } from "../../db.js";
import { ObjectId } from "mongodb";

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