import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

// 📨 Create and send inquiry (Student → Professor)
export const createInquiry = async (req, res) => {
  try {
    const { professorId, studentId, subject, message } = req.body;
    const db = getDB();

    // Validation
    if (!professorId || !studentId || !subject || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check both users exist
    const professor = await db.collection("users").findOne({ _id: new ObjectId(professorId) });
    const student = await db.collection("users").findOne({ _id: new ObjectId(studentId) });

    if (!professor || !student) {
      return res.status(404).json({ success: false, message: "Professor or student not found" });
    }

    // Insert inquiry
    const newInquiry = {
      professorId: new ObjectId(professorId),
      studentId: new ObjectId(studentId),
      subject,
      message,
      createdAt: new Date(),
      status: "pending"
    };

    await db.collection("inquiries").insertOne(newInquiry);

    res.status(201).json({ success: true, message: "Inquiry sent successfully" });
  } catch (error) {
    console.error("❌ Error creating inquiry:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInquiriesByStudent = async (req, res) => {
  try {
    const { studentId } = req.query;
    const db = getDB();

    console.log("📥 Fetching inquiries for student:", studentId);

    if (!studentId) {
      return res.status(400).json({ success: false, message: "Missing studentId" });
    }

    const inquiries = await db.collection("inquiries")
      .find({
        $or: [
          { studentId: new ObjectId(studentId) },
          { studentId: studentId },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`✅ Found ${inquiries.length} inquiries`);

    const inquiriesWithProfessors = await Promise.all(
      inquiries.map(async (inquiry) => {
        try {
          const professor = await db.collection("users").findOne({
            _id: new ObjectId(inquiry.professorId),
            role: "professor",
          });

          return {
            ...inquiry,
            professor: professor
              ? {
                  _id: professor._id,
                  name: `${professor.firstName || ''} ${professor.lastName || ''}`.trim(),
                  initials: `${professor.firstName?.[0] || ''}${professor.lastName?.[0] || ''}`.toUpperCase(),
                  email: professor.emailAddress,
                  department: professor.department,
                  facultyPosition: professor.facultyPosition,
                  office: professor.office,
                  status: professor.status || "not-available",
                }
              : null,
          };
        } catch (err) {
          console.error(`⚠️ Error fetching professor ${inquiry.professorId}:`, err);
          return { ...inquiry, professor: null };
        }
      })
    );

    res.status(200).json({
      success: true,
      data: {
        inquiriesSentCount: inquiriesWithProfessors.length,
        recentInquiries: inquiriesWithProfessors.map((inq) => ({
          id: inq._id,
          subject: inq.subject,
          message: inq.message,
          status: inq.status,
          createdAt: inq.createdAt,
          dateRelative: new Date(inq.createdAt).toLocaleDateString(),
          professor: inq.professor,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching inquiries:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching student inquiries.",
    });
  }
};

// export const getInquiriesByStudent = async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const db = getDB();

//     console.log("📥 Fetching inquiries for student:", studentId);

//     // 🧩 Fetch inquiries for this student (accept both ObjectId and string)
//     const inquiries = await db.collection("inquiries")
//       .find({
//         $or: [
//           { studentId: new ObjectId(studentId) },
//           { studentId: studentId },
//         ],
//       })
//       .sort({ createdAt: -1 })
//       .toArray();

//     console.log(`✅ Found ${inquiries.length} inquiries`);

//     // 🧩 For each inquiry, get the professor details from users collection
//     const inquiriesWithProfessors = await Promise.all(
//       inquiries.map(async (inquiry) => {
//         try {
//           const professor = await db.collection("users").findOne({
//             _id: new ObjectId(inquiry.professorId),
//             role: "professor",
//           });

//           return {
//             ...inquiry,
//             professor: professor
//               ? {
//                   _id: professor._id,
//                   name: `${professor.firstName || ''} ${professor.lastName || ''}`.trim(),
//                   email: professor.emailAddress,
//                   department: professor.department,
//                   facultyPosition: professor.facultyPosition,
//                   office: professor.office,
//                   status: professor.status || "not-available",
//                 }
//               : null,
//           };
//         } catch (err) {
//           console.error(`⚠️ Error fetching professor ${inquiry.professorId}:`, err);
//           return { ...inquiry, professor: null };
//         }
//       })
//     );

//     res.status(200).json({
//       success: true,
//       inquiries: inquiriesWithProfessors,
//     });

//   } catch (error) {
//     console.error("❌ Error fetching inquiries:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching student inquiries.",
//     });
//   }
// };





