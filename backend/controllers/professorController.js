import { getDB } from "../db.js";

export const getAllProfessors = async (req, res) => {
  try {
    const db = getDB();

    const professors = await db.collection("users")
      .find({ role: "professor" })
      .project({
        firstName: 1,
        lastName: 1,
        department: 1,
        facultyPosition: 1,
        office: 1,
        status: 1,
        emailAddress: 1,
        isVerified: 1,
      })
      .toArray();

    // Check if it's weekend
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6; // 0 = Sunday, 6 = Saturday

    const formatted = professors.map(p => {
      // Determine availability status
      let availabilityStatus = "not-available";
      
      if (!isWeekend) {
        // On weekdays, use the professor's actual status
        if (p.status && p.isVerified !== false) {
          availabilityStatus = p.status.toLowerCase();
        } else {
          availabilityStatus = "not-available";
        }
      } else {
        // On weekends, always mark as not available
        availabilityStatus = "not-available";
      }

      return {
        id: p._id.toString(),
        name: `${p.firstName} ${p.lastName}`,
        department: p.department || "Unknown Department",
        office: p.office || "No office assigned",
        email: p.emailAddress,
        available: availabilityStatus,
        isWeekend: isWeekend // Optional: include weekend info for frontend
      };
    });

    res.status(200).json({ 
      success: true, 
      professors: formatted,
      isWeekend: isWeekend, // Include weekend status in response
      currentDay: now.toLocaleDateString('en-US', { weekday: 'long' })
    });

  } catch (error) {
    console.error("Error fetching professors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};