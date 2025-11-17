import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["student", "professor", "admin"], required: true },
  firstName: String,
  lastName: String,
  idNumber: String,
  facultyPosition: String,
  contactNumber: String,
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false }
});

export const User = mongoose.model("User", userSchema);
