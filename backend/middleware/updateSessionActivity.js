import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

export const updateSessionActivity = async (req, res, next) => {
  try {
    if (req.user && req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      const db = getDB("tap2find_db");
      const sessions = db.collection("user_sessions");

      await sessions.updateOne(
        { 
          sessionToken: token,
          userId: new ObjectId(req.user.id)
        },
        { 
          $set: { 
            lastActivity: new Date() 
          } 
        }
      );
    }
    
    next();
  } catch (error) {
    console.error("Session activity update error:", error);
    next();
  }
};