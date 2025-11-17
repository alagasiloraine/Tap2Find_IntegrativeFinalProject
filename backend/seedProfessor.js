// seedProfessors.js
import { connectDB, getDB } from "./db.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// const professors = [
//   {
//     role: "professor",
//     emailAddress: "perjescykean356@gmail.com",
//     password: "professor123", // plain text for now (will be hashed)
//     firstName: "John",
//     middleName: "M",
//     lastName: "Doe",
//     idNumber: "P001",
//     contactNumber: "09171234567",
//     facultyPosition: "Assistant Professor",
//     program: "",
//     yearLevel: "",
//     section: "",
//     avatarUrl: "",
//     coverUrl: "",
//     otp: null,
//     otpExpires: null,
//     isVerified: true,
//     status: "Available",
//   },
// ];

const professors = [
  {
    role: "admin",
    emailAddress: "devpsychopath@gmail.com",
    password: "admin123", // plain text for now (will be hashed)
    firstName: "Admin",
    middleName: "",
    lastName: "User",
    idNumber: "Admin-001",
    contactNumber: "09924334316",
    facultyPosition: "Super Duper Admin",
    program: "",
    yearLevel: "",
    section: "",
    avatarUrl: "",
    coverUrl: "",
    otp: null,
    otpExpires: null,
    isVerified: true,
    status: "Available",
  },
];

const insertProfessors = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const db = getDB();

    // 🔒 Hash passwords before inserting
    const saltRounds = 10;
    const hashedProfessors = await Promise.all(
      professors.map(async (prof) => {
        const hashedPassword = await bcrypt.hash(prof.password, saltRounds);
        return { ...prof, password: hashedPassword };
      })
    );

    await db.collection("users").insertMany(hashedProfessors);
    console.log("✅ Inserted sample professors successfully (with hashed passwords)!");
  } catch (error) {
    console.error("❌ Error seeding professors:", error);
  } finally {
    process.exit();
  }
};

insertProfessors();
