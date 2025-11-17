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
    const rfidLogs = db.collection("rfid_logs"); // Add rfid_logs collection

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

    // ✅ NEW: Get the current user data before update to check if RFID is being changed
    const currentUser = await users.findOne({ _id: new ObjectId(id) });
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const result = await users.updateOne({ _id: new ObjectId(id) }, { $set });
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ NEW: Update RFID logs if idNumber (RFID) is being changed/added
    if ($set.idNumber) {
      const newRfid = $set.idNumber.toUpperCase().trim();
      const oldRfid = currentUser.idNumber ? currentUser.idNumber.toUpperCase().trim() : null;
      
      // Only process if RFID is actually changing (new RFID or different from old)
      if (!oldRfid || newRfid !== oldRfid) {
        
        // Check if there are any unknown RFID logs for the new RFID
        const updateResult = await rfidLogs.updateMany(
          { 
            uid: newRfid,
            type: 'unknown_rfid',
            processed: { $ne: true } // Only update unprocessed logs
          },
          { 
            $set: { 
              processed: true,
              assignedTo: id,
              assignedAt: new Date(),
              assignedName: `${$set.firstName || currentUser.firstName} ${$set.lastName || currentUser.lastName}`,
              assignedRole: currentUser.role,
              updateType: 'user_update'
            } 
          }
        );

        if (updateResult.modifiedCount > 0) {
          console.log(`✅ [RFID AUTO-ASSIGNED] ${newRfid} assigned to ${$set.firstName || currentUser.firstName} ${$set.lastName || currentUser.lastName} (${currentUser.role}) during user update`);
          console.log(`📝 Updated ${updateResult.modifiedCount} RFID log entries`);
        } else {
          console.log(`ℹ️  No unknown RFID logs found for ${newRfid} during user update`);
        }

        // If user had a previous RFID and it's being changed, we might want to handle that too
        if (oldRfid && newRfid !== oldRfid) {
          console.log(`🔄 User RFID changed from ${oldRfid} to ${newRfid}`);
          
          // Optional: You could mark the old RFID as available again if needed
          // This would require additional logic based on your business rules
        }
      }
    }

    const updated = await users.findOne({ _id: new ObjectId(id) }, { projection: { password: 0, otp: 0, otpExpires: 0 } });
    return res.status(200).json({ 
      success: true, 
      user: updated,
      rfidUpdated: !!$set.idNumber // Indicate if RFID was updated
    });
    
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