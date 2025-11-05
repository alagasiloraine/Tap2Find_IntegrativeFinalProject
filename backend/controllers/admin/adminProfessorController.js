// Get latest schedule metadata for a professor
export const getProfessorScheduleMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB("tap2find_db");
    const bucket = new GridFSBucket(db, { bucketName: "schedules" });

    const file = await bucket
      .find({ "metadata.professorId": new ObjectId(id) })
      .sort({ uploadDate: -1 })
      .limit(1)
      .next();

    if (!file) return res.status(404).json({ success: false, message: "No schedule" });

    return res.status(200).json({
      success: true,
      file: {
        fileId: file._id,
        filename: file.filename,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      },
    });
  } catch (err) {
    console.error("Error getting schedule meta:", err);
    return res.status(500).json({ success: false, message: "Failed to load schedule meta" });
  }
};

import { getDB } from "../../db.js";
import { ObjectId, GridFSBucket } from "mongodb";
import { Readable } from "stream";

// Get professors only
export const getProfessors = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const list = await users
      .find(
        { $expr: { $eq: [ { $toLower: { $trim: { input: "$role" } } }, "professor" ] } },
        { projection: { password: 0, otp: 0, otpExpires: 0 } }
      )
      .sort({ _id: -1 })
      .limit(100)
      .toArray();

    return res.status(200).json({ success: true, professors: list });
  } catch (err) {
    console.error("Error fetching professors:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch professors" });
  }
};

// Upload a schedule file for a professor to GridFS
export const uploadProfessorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const db = getDB("tap2find_db");
    const users = db.collection("users");
    const prof = await users.findOne({ _id: new ObjectId(id) });
    if (!prof) {
      return res.status(404).json({ success: false, message: "Professor not found" });
    }

    const bucket = new GridFSBucket(db, { bucketName: "schedules" });
    const timestamp = Date.now();
    const safeName = (req.file.originalname || "file").replace(/[^a-z0-9_.-]/gi, "_");
    const filename = `${timestamp}_${safeName}`;

    const readable = Readable.from(req.file.buffer);
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: { professorId: new ObjectId(id) },
    });

    await new Promise((resolve, reject) => {
      readable.pipe(uploadStream)
        .on("error", reject)
        .on("finish", resolve);
    });

    const fileId = uploadStream.id;

    // Update professor_schedules collection: first upload sets latest only; replacements move previous latest to history
    const schedulesColl = db.collection("professor_schedules");
    const newLatest = {
      fileId,
      filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    const existing = await schedulesColl.findOne({ professorId: new ObjectId(id) });
    if (existing && existing.latest) {
      // Replacement: push previous latest to history, set new latest
      await schedulesColl.updateOne(
        { professorId: new ObjectId(id) },
        {
          $set: { latest: newLatest, updatedAt: new Date() },
          $push: { history: existing.latest },
        }
      );
    } else {
      // First upload: only set latest; ensure history array exists
      await schedulesColl.updateOne(
        { professorId: new ObjectId(id) },
        {
          $set: { professorId: new ObjectId(id), latest: newLatest, updatedAt: new Date() },
          $setOnInsert: { history: [] },
        },
        { upsert: true }
      );
    }

    return res.status(201).json({ success: true, schedule: { fileId, filename, originalname: req.file.originalname } });
  } catch (err) {
    console.error("Error uploading schedule:", err);
    return res.status(500).json({ success: false, message: "Failed to upload schedule" });
  }
};

// Download latest (or specific) schedule for a professor from GridFS
export const downloadProfessorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileId, download } = req.query;
    const db = getDB("tap2find_db");
    const bucket = new GridFSBucket(db, { bucketName: "schedules" });

    let fileRecord;
    if (fileId) {
      // Find exact file in GridFS by _id
      fileRecord = await bucket.find({ _id: new ObjectId(fileId), "metadata.professorId": new ObjectId(id) }).limit(1).next();
    } else {
      // Latest by uploadDate in GridFS files collection
      fileRecord = await bucket.find({ "metadata.professorId": new ObjectId(id) }).sort({ uploadDate: -1 }).limit(1).next();
    }

    if (!fileRecord) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    res.setHeader("Content-Type", fileRecord.contentType || "application/octet-stream");
    const downloadName = fileRecord.filename;
    const isDownload = String(download).toLowerCase() === "1" || String(download).toLowerCase() === "true";
    res.setHeader("Content-Disposition", `${isDownload ? "attachment" : "inline"}; filename="${downloadName}"`);

    const stream = bucket.openDownloadStream(fileRecord._id);
    stream.on("error", (err) => {
      console.error("Download error:", err);
      if (!res.headersSent) res.status(500).json({ success: false, message: "Failed to download file" });
    });
    stream.pipe(res);
  } catch (err) {
    console.error("Error downloading schedule:", err);
    return res.status(500).json({ success: false, message: "Failed to download schedule" });
  }
};