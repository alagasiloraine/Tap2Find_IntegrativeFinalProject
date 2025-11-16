import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

// Change Password (protected)
export const changePassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ success: false, message: 'Missing token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const { currentPassword, newPassword, confirmPassword } = req.body || {}
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All password fields are required' })
    }
    if (String(newPassword) !== String(confirmPassword)) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' })
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' })
    }

    const db = getDB('tap2find_db')
    const users = db.collection('users')
    const userId = new ObjectId(String(decoded.id))
    const user = await users.findOne({ _id: userId })
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const ok = await bcrypt.compare(String(currentPassword), String(user.password || ''))
    if (!ok) return res.status(400).json({ success: false, message: 'Current password is incorrect' })

    const hashed = await bcrypt.hash(String(newPassword), 10)
    await users.updateOne({ _id: userId }, { $set: { password: hashed } })

    return res.status(200).json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
};

// List active sessions for current user (protected)
export const getSessions = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ success: false, message: 'Missing token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const db = getDB('tap2find_db')
    const sessions = db.collection('sessions')
    const docs = await sessions
      .find({ userId: new ObjectId(String(decoded.id)) })
      .sort({ lastActive: -1 })
      .toArray()

    const payload = docs.map(s => ({
      _id: String(s._id),
      userAgent: s.userAgent || 'Unknown',
      ip: s.ip || '',
      createdAt: s.createdAt || '',
      lastActive: s.lastActive || s.createdAt || '',
    }))

    return res.status(200).json({ success: true, sessions: payload })
  } catch (error) {
    console.error('Get sessions error:', error)
    return res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
}

// Sign out a specific session (protected)
export const signOutSession = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ success: false, message: 'Missing token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const db = getDB('tap2find_db')
    const sessions = db.collection('sessions')
    const { id } = req.params
    const del = await sessions.deleteOne({ _id: new ObjectId(String(id)), userId: new ObjectId(String(decoded.id)) })
    if (del.deletedCount === 0) return res.status(404).json({ success: false, message: 'Session not found' })
    return res.status(200).json({ success: true, message: 'Signed out session' })
  } catch (error) {
    console.error('Sign out session error:', error)
    return res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
}

// Sign out all sessions for user (protected)
export const signOutAllSessions = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ success: false, message: 'Missing token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const db = getDB('tap2find_db')
    const sessions = db.collection('sessions')
    await sessions.deleteMany({ userId: new ObjectId(String(decoded.id)) })
    return res.status(200).json({ success: true, message: 'Signed out of all devices' })
  } catch (error) {
    console.error('Sign out all error:', error)
    return res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
}

// Update security settings: twoFA, otpChannel (protected)
export const updateSecurity = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ success: false, message: 'Missing token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const { twoFA, otpChannel } = req.body || {}
    const db = getDB('tap2find_db')
    const users = db.collection('users')
    const updates = {}
    if (typeof twoFA === 'boolean') updates.twoFA = twoFA
    if (otpChannel === 'email' || otpChannel === 'sms') updates.otpChannel = otpChannel
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' })
    }
    await users.updateOne({ _id: new ObjectId(String(decoded.id)) }, { $set: updates })
    const fresh = await users.findOne({ _id: new ObjectId(String(decoded.id)) })
    return res.status(200).json({ success: true, user: fresh })
  } catch (error) {
    console.error('Update security error:', error)
    return res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
}
