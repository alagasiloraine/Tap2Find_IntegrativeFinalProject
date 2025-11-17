import { getDB } from "../../db.js";
import { ObjectId, GridFSBucket } from "mongodb";
import { Readable } from "stream";

// Get professor's manual schedule
export const getProfessorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB("tap2find_db");
    const schedules = db.collection("professor_schedules");

    const scheduleDoc = await schedules.findOne({ 
      professorId: new ObjectId(id) 
    });

    return res.status(200).json({
      success: true,
      schedule: scheduleDoc?.schedule || []
    });
  } catch (err) {
    console.error("Error getting schedule:", err);
    return res.status(500).json({ success: false, message: "Failed to load schedule" });
  }
};

// Save professor's manual schedule
export const saveProfessorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedule } = req.body;

    console.log('Saving manual schedule for professor:', id);
    console.log('Schedule data:', schedule);

    if (!Array.isArray(schedule)) {
      return res.status(400).json({ success: false, message: "Invalid schedule data" });
    }

    const db = getDB("tap2find_db");
    const users = db.collection("users");
    const schedules = db.collection("professor_schedules");

    // Verify professor exists
    const prof = await users.findOne({ _id: new ObjectId(id) });
    if (!prof) {
      return res.status(404).json({ success: false, message: "Professor not found" });
    }

    // Validate schedule data
    for (const entry of schedule) {
      if (!entry.day || !entry.startTime || !entry.endTime || !entry.subject || !entry.room) {
        return res.status(400).json({ 
          success: false, 
          message: "Each schedule entry must have day, startTime, endTime, subject, and room" 
        });
      }

      if (entry.startTime >= entry.endTime) {
        return res.status(400).json({ 
          success: false, 
          message: "Start time must be before end time" 
        });
      }

      // Validate time range (7 AM to 6 PM)
      if (entry.startTime < 7 || entry.endTime > 19) {
        return res.status(400).json({
          success: false,
          message: "Schedule time must be between 7:00 AM and 6:00 PM"
        });
      }

      // Validate day
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      if (!validDays.includes(entry.day)) {
        return res.status(400).json({
          success: false,
          message: "Invalid day. Must be Monday to Friday"
        });
      }
    }

    // Check for overlapping schedules within the same day
    const dayGroups = {};
    schedule.forEach(entry => {
      if (!dayGroups[entry.day]) {
        dayGroups[entry.day] = [];
      }
      dayGroups[entry.day].push(entry);
    });

    for (const day in dayGroups) {
      const daySchedules = dayGroups[day].sort((a, b) => a.startTime - b.startTime);
      
      for (let i = 0; i < daySchedules.length - 1; i++) {
        const current = daySchedules[i];
        const next = daySchedules[i + 1];
        
        if (current.endTime > next.startTime) {
          return res.status(400).json({
            success: false,
            message: `Schedule overlap detected on ${day}: ${current.subject} (${formatTime(current.startTime)}-${formatTime(current.endTime)}) overlaps with ${next.subject} (${formatTime(next.startTime)}-${formatTime(next.endTime)})`
          });
        }
      }
    }

    // Prepare schedule data for storage
    const scheduleData = schedule.map(entry => ({
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      subject: entry.subject,
      room: entry.room,
      createdAt: new Date()
    }));

    // Save or update schedule
    const result = await schedules.updateOne(
      { professorId: new ObjectId(id) },
      {
        $set: { 
          schedule: scheduleData,
          updatedAt: new Date(),
          professorName: `${prof.firstName} ${prof.lastName}`,
          professorEmail: prof.emailAddress,
          scheduleType: 'manual' // Mark as manual schedule
        },
        $setOnInsert: {
          professorId: new ObjectId(id),
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log('Manual schedule saved successfully:', result);

    return res.status(200).json({ 
      success: true, 
      message: "Schedule saved successfully",
      scheduleCount: schedule.length
    });
  } catch (err) {
    console.error("Error saving schedule:", err);
    
    // Handle specific MongoDB errors
    if (err.name === 'BSONError') {
      return res.status(400).json({ success: false, message: "Invalid professor ID format" });
    }
    
    return res.status(500).json({ success: false, message: "Failed to save schedule" });
  }
};

// Helper function to format time for error messages
const formatTime = (hour) => {
  if (hour === 12) return '12:00 PM';
  if (hour > 12) return `${hour - 12}:00 PM`;
  return `${hour}:00 AM`;
};

// Get latest schedule metadata for a professor (keep for file-based schedules)
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

// Upload a schedule file for a professor to GridFS (keep for file-based schedules)
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

// Download latest (or specific) schedule for a professor from GridFS (keep for file-based schedules)
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

// Get professor schedule with both manual and file-based data
export const getProfessorFullSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB("tap2find_db");
    const schedulesColl = db.collection("professor_schedules");
    const bucket = new GridFSBucket(db, { bucketName: "schedules" });

    // Get manual schedule
    const manualSchedule = await schedulesColl.findOne({ 
      professorId: new ObjectId(id),
      scheduleType: 'manual'
    });

    // Get file-based schedule
    const fileSchedule = await bucket
      .find({ "metadata.professorId": new ObjectId(id) })
      .sort({ uploadDate: -1 })
      .limit(1)
      .next();

    return res.status(200).json({
      success: true,
      manualSchedule: manualSchedule?.schedule || [],
      fileSchedule: fileSchedule ? {
        fileId: fileSchedule._id,
        filename: fileSchedule.filename,
        uploadDate: fileSchedule.uploadDate,
        contentType: fileSchedule.contentType,
      } : null,
      hasManualSchedule: !!manualSchedule?.schedule?.length,
      hasFileSchedule: !!fileSchedule
    });
  } catch (err) {
    console.error("Error getting full schedule:", err);
    return res.status(500).json({ success: false, message: "Failed to load schedule data" });
  }
};