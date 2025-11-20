import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";
import { UAParser } from 'ua-parser-js'; 

// 📧 Setup email transporter (use App Password if Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "perjescykean35@gmail.com",
    pass: "tvuo wqip iyxs jens",
  },
});

// 📌 Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// (moved) me handler is now in studentprofileController.js

// 🧩 Register User and send OTP
export const registerUser = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const { role, emailAddress, password, firstName, middleName, lastName, idNumber, contactNumber, facultyPosition, program, yearLevel, section, avatarUrl, coverUrl } = req.body;

    const existingUser = await users.findOne({ emailAddress });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; 

    const newUser = {
      role,
      emailAddress,
      password: hashedPassword,
      firstName,
      middleName: middleName || '',
      lastName,
      idNumber,
      contactNumber,
      facultyPosition,
      program: program || '',
      yearLevel: yearLevel || '',
      section: section || '',
      avatarUrl: avatarUrl || '',
      coverUrl: coverUrl || '',
      otp,
      otpExpires,
      isVerified: false,
    };
    await users.insertOne(newUser);

    // ✉️ Send OTP Email
    await transporter.sendMail({
      from: `"Tap2Find Authentication" <${process.env.EMAIL_USER}>`,
      to: emailAddress,
      subject: "Your Tap2Find Verification Code",
      html: `
        <h2>Welcome to Tap2Find</h2>
        <p>Your email verification code is:</p>
        <h1>${otp}</h1>
        <p>This code will expire in <b>5 minutes</b>.</p>
      `,
    });

    res.status(201).json({
      message: "User registered successfully. Please check your email for the OTP verification code.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🧾 Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");
    const { emailAddress, otp } = req.body;

    const user = await users.findOne({ emailAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "User already verified" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });

    await users.updateOne(
      { emailAddress },
      { $set: { isVerified: true }, $unset: { otp: "", otpExpires: "" } }
    );

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔁 Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");
    const { emailAddress } = req.body;

    const user = await users.findOne({ emailAddress });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const newOTP = generateOTP();
    const newExpiry = Date.now() + 5 * 60 * 1000;

    await users.updateOne(
      { emailAddress },
      { $set: { otp: newOTP, otpExpires: newExpiry } }
    );

    await transporter.sendMail({
      from: `"Tap2Find Authentication" <${process.env.EMAIL_USER}>`,
      to: emailAddress,
      subject: "Your new Tap2Find verification code",
      html: `
        <h2>Resent Verification Code</h2>
        <p>Your new email verification code is:</p>
        <h1>${newOTP}</h1>
        <p>This code will expire in <b>5 minutes</b>.</p>
      `,
    });

    res.status(200).json({ message: "New OTP sent successfully!" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔐 Login
export const loginUser = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");
    const sessions = db.collection("user_sessions");
    
    const { email, password } = req.body;

    console.log('🔐 Login attempt for email:', email);

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    const user = await users.findOne({ emailAddress: email });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your email is not verified. Please verify it before logging in.",
      });
    }

    const token = jwt.sign({ 
      id: user._id.toString(), 
      role: user.role 
    }, process.env.JWT_SECRET || 'fallback-secret-key-for-development', {
      expiresIn: "1d",
    });

    const when = new Date();
    const agent = req.headers['user-agent'] || 'Unknown';
    
    // Get IP address
    const ipAddress = req.ip || 
                     req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     req.connection.socket?.remoteAddress || 
                     'Unknown';
    
    const deviceInfo = parseUserAgent(agent);
    const location = await getLocationFromIP(ipAddress);

    console.log('💻 Session details:', {
      device: deviceInfo,
      ip: ipAddress,
      location: location
    });

    // Check if an active session already exists for this device
    const existingSession = await sessions.findOne({
      userId: user._id,
      userAgent: deviceInfo,
      ipAddress: ipAddress,
      expiresAt: { $gt: new Date() } // Only consider active sessions
    });

    let sessionId;
    
    if (existingSession) {
      // Update existing session
      console.log('🔄 Updating existing session');
      await sessions.updateOne(
        { _id: existingSession._id },
        { 
          $set: { 
            sessionToken: token,
            lastActivity: when,
            expiresAt: new Date(when.getTime() + 24 * 60 * 60 * 1000), // Renew expiry
            location: location // Update location in case it changed
          } 
        }
      );
      sessionId = existingSession._id;
    } else {
      // Create new session
      console.log('🆕 Creating new session');
      const sessionData = {
        userId: user._id,
        sessionToken: token,
        userAgent: deviceInfo,
        ipAddress: ipAddress,
        location: location,
        lastActivity: when,
        expiresAt: new Date(when.getTime() + 24 * 60 * 60 * 1000),
        createdAt: when
      };

      const result = await sessions.insertOne(sessionData);
      sessionId = result.insertedId;
    }

    // Update user's last login
    await users.updateOne({ _id: user._id }, { 
      $set: { 
        lastLogin: when, 
        lastLoginAgent: agent,
        updatedAt: when
      } 
    });

    // Prepare user data for response
    const userResponse = {
      id: user._id,
      role: user.role,
      emailAddress: user.emailAddress,
      firstName: user.firstName,
      middleName: user.middleName || '',
      lastName: user.lastName,
      birthdate: user.birthdate || '',
      address: user.address || '',
      idNumber: user.idNumber || '',
      contactNumber: user.contactNumber || '',
      program: user.program || '',
      yearLevel: user.yearLevel || '',
      section: user.section || '',
      avatarUrl: user.avatarUrl || '',
      coverUrl: user.coverUrl || '',
      lastLogin: when,
      lastLoginAgent: agent,
      status: user.status || 'Unavailable',
    };

    console.log(existingSession ? '✅ Session updated' : '✅ New session created');

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during login"
    });
  }
};

// Simple user agent parser without external dependencies
const parseUserAgent = (userAgent) => {
  if (!userAgent || userAgent === 'Unknown') return 'Unknown Device';
  
  const ua = userAgent.toLowerCase();
  
  // Detect browser
  let browser = 'Unknown Browser';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // Detect OS
  let os = 'Unknown OS';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os') || ua.includes('macos')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  return `${browser} on ${os}`;
};

// Helper function to get location from IP (simplified)
const getLocationFromIP = async (ip) => {
  // For local development
  if (ip === '127.0.0.1' || ip === '::1') {
    return 'Localhost';
  }
  
  // Remove IPv6 prefix if present
  const cleanIp = ip.replace(/^::ffff:/, '');
  
  // Skip private IP ranges
  if (isPrivateIP(cleanIp)) {
    return 'Local Network';
  }

  try {
    // Option 1: ipinfo.io (1000 free requests/day)
    const response = await fetch(`https://ipinfo.io/${cleanIp}?token=f574af6e231278`);
    
    if (!response.ok) {
      throw new Error(`IP info API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.warn('IP info API error:', data.error);
      return `${cleanIp} (Location Unknown)`;
    }
    
    // Format location: City, Region, Country
    const locationParts = [];
    if (data.city && data.city !== '') locationParts.push(data.city);
    if (data.region && data.region !== '' && data.region !== data.city) locationParts.push(data.region);
    if (data.country && data.country !== '') locationParts.push(data.country);
    
    return locationParts.length > 0 ? locationParts.join(', ') : `${cleanIp} (Location Unknown)`;
    
  } catch (error) {
    console.error('IP geolocation error:', error.message);
    
    // Fallback: Try ipapi.co
    try {
      const fallbackResponse = await fetch(`https://ipapi.co/${cleanIp}/json/`);
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.error) {
          return `${cleanIp} (Location Unknown)`;
        }
        
        const locationParts = [];
        if (fallbackData.city) locationParts.push(fallbackData.city);
        if (fallbackData.region) locationParts.push(fallbackData.region);
        if (fallbackData.country_name) locationParts.push(fallbackData.country_name);
        
        return locationParts.length > 0 ? locationParts.join(', ') : `${cleanIp} (Location Unknown)`;
      }
    } catch (fallbackError) {
      console.error('Fallback IP geolocation error:', fallbackError.message);
    }
    
    return `${cleanIp} (Location Unknown)`;
  }
};

// Helper function to check if IP is in private range
const isPrivateIP = (ip) => {
  // IPv4 private ranges
  if (ip.includes('.')) {
    const parts = ip.split('.').map(part => parseInt(part, 10));
    
    // 10.0.0.0/8
    if (parts[0] === 10) return true;
    
    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    
    // 127.0.0.0/8 (localhost)
    if (parts[0] === 127) return true;
    
    // 169.254.0.0/16 (link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;
  }
  
  // IPv6 private ranges
  if (ip.includes(':')) {
    // ::1/128 (localhost)
    if (ip === '::1') return true;
    
    // fc00::/7 (unique local address)
    if (ip.startsWith('fc') || ip.startsWith('fd')) return true;
    
    // fe80::/10 (link-local)
    if (ip.startsWith('fe80:')) return true;
  }
  
  return false;
}

// 🧾 Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");
    const { email, emailAddress } = req.body;
    const targetEmail = email || emailAddress;

    const user = await users.findOne({ emailAddress: targetEmail });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Tap2Find Support" <${process.env.EMAIL_USER}>`,
      to: targetEmail,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.firstName || "User"},</p>
        <p>You requested to reset your password. Click below:</p>
        <a href="${resetLink}" style="background-color:#22c55e;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>This link expires in 10 minutes.</p>
      `,
    });

    res.status(200).json({ success: true, message: "Password reset email sent." });
  } catch (error) {
    console.error("Reset email error:", error);
    res.status(500).json({ success: false, message: "Failed to send reset email.", error: error.message });
  }
};

// 🔑 Reset password
export const resetPassword = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await users.findOne({ _id: new ObjectId(decoded.id) });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await users.updateOne({ _id: user._id }, { $set: { password: hashed } });

    res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(400).json({ success: false, message: "Reset token expired. Please request a new link." });

    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password.", error: error.message });
  }
};

// (moved) updateProfile handler is now in studentprofileController.js