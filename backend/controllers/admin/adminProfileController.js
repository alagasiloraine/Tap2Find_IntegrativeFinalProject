import { ObjectId } from "mongodb";
import { getDB } from "../../db.js";

// Get admin profile by ID (without sensitive fields)
export const getAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const user = await users.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0, otp: 0, otpExpires: 0 } }
    );

    if (!user) return res.status(404).json({ success: false, message: "Admin not found" });
    if (String(user.role || '').toLowerCase().trim() !== 'admin') {
      return res.status(403).json({ success: false, message: "Not an admin account" });
    }

    return res.status(200).json({ success: true, admin: user });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch admin profile" });
  }
};

// Update admin profile by ID (no password change here)
export const updateAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const allowed = [
      "firstName",
      "lastName",
      "emailAddress",
      "contactNumber",
      "address",
      "program",
      "yearLevel",
      "birthdate",
      "section",
      "idNumber",
      "facultyPosition",
    ];

    const $set = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
        $set[key] = req.body[key];
      }
    }

    const toTitle = (s) => !s ? "" : String(s).replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

    if (Object.prototype.hasOwnProperty.call($set, 'emailAddress') && typeof $set.emailAddress === 'string') {
      $set.emailAddress = $set.emailAddress.trim().toLowerCase();
    }
    if (Object.prototype.hasOwnProperty.call($set, 'firstName') && typeof $set.firstName === 'string') {
      $set.firstName = toTitle(($set.firstName || '').trim());
    }
    if (Object.prototype.hasOwnProperty.call($set, 'lastName') && typeof $set.lastName === 'string') {
      $set.lastName = toTitle(($set.lastName || '').trim());
    }
    if (Object.prototype.hasOwnProperty.call($set, 'section') && typeof $set.section === 'string') {
      $set.section = toTitle(($set.section || '').trim());
    }

    if (Object.prototype.hasOwnProperty.call($set, 'birthdate')) {
      const d = new Date($set.birthdate);
      if (!isNaN(d.getTime())) {
        const today = new Date();
        let a = today.getFullYear() - d.getFullYear();
        const m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate())) a--;
        $set.age = a;
        $set.birthdate = d.toISOString();
      } else {
        delete $set.birthdate;
      }
    }

    if (Object.keys($set).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields provided to update" });
    }

    const existing = await users.findOne({ _id: new ObjectId(id) }, { projection: { role: 1 } });
    if (!existing) return res.status(404).json({ success: false, message: "Admin not found" });
    if (String(existing.role || '').toLowerCase().trim() !== 'admin') {
      return res.status(403).json({ success: false, message: "Not an admin account" });
    }

    const result = await users.updateOne({ _id: new ObjectId(id) }, { $set });
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Admin not found" });

    const updated = await users.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0, otp: 0, otpExpires: 0 } }
    );

    return res.status(200).json({ success: true, admin: updated });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return res.status(500).json({ success: false, message: "Failed to update admin profile" });
  }
};

export const uploadAdminPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const existing = await users.findOne({ _id: new ObjectId(id) }, { projection: { role: 1 } });
    if (!existing) return res.status(404).json({ success: false, message: "Admin not found" });
    if (String(existing.role || '').toLowerCase().trim() !== 'admin') {
      return res.status(403).json({ success: false, message: "Not an admin account" });
    }

    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return res.status(400).json({ success: false, message: "Unsupported file type" });
    }
    const maxBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxBytes) {
      return res.status(400).json({ success: false, message: "File too large (max 2MB)" });
    }

    const base64 = file.buffer.toString('base64');
    const photoBase64 = base64;
    const photoMime = file.mimetype;

    await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { photoBase64, photoMime, updatedAt: new Date() } }
    );

    const updated = await users.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0, otp: 0, otpExpires: 0 } }
    );

    return res.status(200).json({ success: true, admin: updated });
  } catch (error) {
    console.error("Error uploading admin photo:", error);
    return res.status(500).json({ success: false, message: "Failed to upload admin photo" });
  }
};
