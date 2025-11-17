import { getDB } from "../db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

// Change user password
export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be at least 6 characters long" 
      });
    }

    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          password: hashedNewPassword,
          updatedAt: new Date()
        } 
      }
    );

    console.log(`✅ Password updated successfully for user: ${user.emailAddress}`);

    res.status(200).json({ 
      success: true, 
      message: "Password updated successfully" 
    });

  } catch (error) {
    console.error("❌ Error changing password:", error);
    
    if (error.name === 'BSONError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error while changing password" 
    });
  }
};

// Get user notification preferences
export const getNotificationPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const user = await users.findOne({ 
      _id: new ObjectId(userId) 
    }, {
      projection: {
        notificationPreferences: 1,
        emailAddress: 1,
        contactNumber: 1
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const defaultPreferences = {
      enabled: true,
      channels: {
        email: true,
        sms: false
      }
    };

    const preferences = user.notificationPreferences || defaultPreferences;

    res.status(200).json({
      success: true,
      data: {
        preferences,
        email: user.emailAddress,
        phone: user.contactNumber
      }
    });

  } catch (error) {
    console.error("❌ Error getting notification preferences:", error);
    
    if (error.name === 'BSONError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching preferences" 
    });
  }
};

// Update user notification preferences
export const updateNotificationPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ 
        success: false, 
        message: "Notification preferences are required" 
      });
    }

    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          notificationPreferences: preferences,
          updatedAt: new Date()
        } 
      }
    );

    console.log(`✅ Notification preferences updated for user: ${user.emailAddress}`);

    res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      data: { preferences }
    });

  } catch (error) {
    console.error("❌ Error updating notification preferences:", error);
    
    if (error.name === 'BSONError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating preferences" 
    });
  }
};

// Get active sessions for user
export const getActiveSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDB("tap2find_db");
    const sessions = db.collection("user_sessions");

    const activeSessions = await sessions.find({
      userId: new ObjectId(userId),
      expiresAt: { $gt: new Date() }
    }).sort({ lastActivity: -1 }).toArray();

    const currentSessionToken = req.headers.authorization?.replace('Bearer ', '');

    const formattedSessions = activeSessions.map(session => ({
      id: session._id,
      device: session.userAgent,
      location: session.location,
      ipAddress: session.ipAddress,
      lastActive: session.lastActivity,
      isCurrent: session.sessionToken === currentSessionToken
    }));

    res.status(200).json({
      success: true,
      data: {
        sessions: formattedSessions
      }
    });

  } catch (error) {
    console.error("❌ Error getting active sessions:", error);
    
    if (error.name === 'BSONError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching sessions" 
    });
  }
};

// Sign out specific session
export const signOutSession = async (req, res) => {
  try {
    const { userId, sessionId } = req.params;
    const db = getDB("tap2find_db");
    const sessions = db.collection("user_sessions");

    const result = await sessions.deleteOne({
      _id: new ObjectId(sessionId),
      userId: new ObjectId(userId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Session not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Session signed out successfully"
    });

  } catch (error) {
    console.error("❌ Error signing out session:", error);
    
    if (error.name === 'BSONError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid session ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error while signing out session" 
    });
  }
};

// Sign out all sessions except current
export const signOutAllSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentSessionToken = req.headers.authorization?.replace('Bearer ', '');
    const db = getDB("tap2find_db");
    const sessions = db.collection("user_sessions");

    const deleteFilter = {
      userId: new ObjectId(userId),
      expiresAt: { $gt: new Date() }
    };

    if (currentSessionToken) {
      deleteFilter.sessionToken = { $ne: currentSessionToken };
    }

    const result = await sessions.deleteMany(deleteFilter);

    res.status(200).json({
      success: true,
      message: `Signed out from ${result.deletedCount} devices`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error("❌ Error signing out all sessions:", error);
    
    if (error.name === 'BSONError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error while signing out sessions" 
    });
  }
};

// Get user security settings
export const getSecuritySettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const user = await users.findOne({ 
      _id: new ObjectId(userId) 
    }, {
      projection: {
        twoFactorAuth: 1,
        otpChannel: 1,
        emailAddress: 1,
        contactNumber: 1,
        lastLogin: 1,
        loginHistory: 1
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const securitySettings = {
      twoFA: user.twoFactorAuth || false,
      otpChannel: user.otpChannel || 'email',
      lastLogin: user.lastLogin,
      loginHistory: user.loginHistory || []
    };

    res.status(200).json({
      success: true,
      data: securitySettings
    });

  } catch (error) {
    console.error("❌ Error getting security settings:", error);
    
    if (error.name === 'BSONError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching security settings" 
    });
  }
};

// Update security settings (2FA)
export const updateSecuritySettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { twoFA, otpChannel } = req.body;

    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const updateData = {
      twoFactorAuth: twoFA,
      updatedAt: new Date()
    };

    if (twoFA && otpChannel) {
      updateData.otpChannel = otpChannel;
      
      if (otpChannel === 'sms' && !user.contactNumber) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required for SMS notifications. Please update your profile."
        });
      }
    }

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    console.log(`✅ Security settings updated for user: ${user.emailAddress}`);

    res.status(200).json({
      success: true,
      message: "Security settings updated successfully"
    });

  } catch (error) {
    console.error("❌ Error updating security settings:", error);
    
    if (error.name === 'BSONError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating security settings" 
    });
  }
};