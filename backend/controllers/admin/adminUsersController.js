import { ObjectId } from "mongodb";
import { getDB } from "../../db.js";

// Get non-admin users
export const getUsers = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const list = await users
      .find(
        { $expr: { $eq: [ { $toLower: { $trim: { input: "$role" } } }, "student" ] } },
        { projection: { password: 0, otp: 0, otpExpires: 0 } }
      )
      .sort({ _id: -1 })
      .limit(100)
      .toArray();

    return res.status(200).json({ success: true, users: list });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const allowed = ["firstName", "lastName", "section", "idNumber", "emailAddress", "isVerified", "contactNumber"];
    const $set = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        $set[key] = req.body[key];
      }
    }

    if (Object.keys($set).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields provided to update" });
    }

    const result = await users.updateOne({ _id: new ObjectId(id) }, { $set });
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updated = await users.findOne({ _id: new ObjectId(id) }, { projection: { password: 0, otp: 0, otpExpires: 0 } });
    return res.status(200).json({ success: true, user: updated });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ success: false, message: "Failed to update user", error: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const result = await users.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
  }
};