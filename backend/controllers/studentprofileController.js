import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

// 👤 Get current user (protected)
export const me = async (req, res) => {
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
    
    // ✅ REMOVED: Session validation requirement
    // The session ID check is now optional - if not provided, we proceed with token validation only
    
    const users = db.collection('users')
    const user = await users.findOne({ _id: new ObjectId(String(decoded.id)) })
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        role: user.role,
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        birthdate: user.birthdate,
        address: user.address,
        idNumber: user.idNumber,
        contactNumber: user.contactNumber,
        program: user.program,
        yearLevel: user.yearLevel,
        section: user.section,
        lastLogin: user.lastLogin,
        lastLoginAgent: user.lastLoginAgent,
        avatarUrl: user.avatarUrl,
        coverUrl: user.coverUrl,
        // ✅ ADDED: Include status field for professors
        status: user.status || 'not-available',
      },
    })
  } catch (error) {
    console.error('Me error:', error)
    return res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
}

// ✏️ Update Profile (protected)
export const updateProfile = async (req, res) => {
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
    const users = db.collection('users')

    const allowed = [
      'firstName', 'lastName', 'middleName', 'birthdate', 'address',
      'idNumber', 'contactNumber', 'program', 'yearLevel', 'section', 'emailAddress',
      'avatarUrl', 'coverUrl'
    ]
    const updates = {}
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) updates[k] = req.body[k]
    }

    // Handle password change if requested
    const { currentPassword, newPassword } = req.body || {}
    const userId = new ObjectId(String(decoded.id))
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new password are required' })
      }
      const existing = await users.findOne({ _id: userId })
      if (!existing) return res.status(404).json({ success: false, message: 'User not found' })
      const ok = await bcrypt.compare(String(currentPassword), String(existing.password || ''))
      if (!ok) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' })
      }
      const hashed = await bcrypt.hash(String(newPassword), 10)
      updates.password = hashed
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' })
    }

    await users.updateOne({ _id: userId }, { $set: updates })

    const fresh = await users.findOne({ _id: userId })
    if (!fresh) return res.status(404).json({ success: false, message: 'User not found' })

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: fresh._id,
        role: fresh.role,
        emailAddress: fresh.emailAddress,
        firstName: fresh.firstName,
        middleName: fresh.middleName,
        lastName: fresh.lastName,
        birthdate: fresh.birthdate,
        address: fresh.address,
        idNumber: fresh.idNumber,
        contactNumber: fresh.contactNumber,
        program: fresh.program,
        yearLevel: fresh.yearLevel,
        section: fresh.section,
        avatarUrl: fresh.avatarUrl,
        coverUrl: fresh.coverUrl,
        lastLogin: fresh.lastLogin,
        lastLoginAgent: fresh.lastLoginAgent,
      },
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
}
