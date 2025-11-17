// seedNotifications.js
import { ObjectId } from "mongodb";
import { connectDB, getDB, client } from "./db.js";

const runSeeder = async () => {
  try {
    // 1️⃣ Connect to database
    await connectDB();
    const db = getDB();
    const collection = db.collection("notifications");

    // 2️⃣ Prepare sample data
    const generalNotification = {
      title: "📢 System Maintenance",
      message: "The system will be under maintenance tonight from 10:00 PM to 12:00 AM.",
      type: "system",
      isGeneral: true,
      createdAt: new Date(),
    };

    const personalNotification = {
      title: "💬 Inquiry Response",
      message: "Professor Santos replied to your inquiry regarding Project Proposal.",
      type: "inquiry",
      studentId: new ObjectId("6902a6eea2086f61860b18db"),
      isGeneral: false,
      createdAt: new Date(),
    };

    // 3️⃣ Insert sample data
    const result = await collection.insertMany([generalNotification, personalNotification]);

    console.log("✅ Notifications seeded successfully!");
    console.log(result.insertedIds);
  } catch (error) {
    console.error("❌ Error seeding notifications:", error);
  } finally {
    await client.close();
    console.log("🔒 MongoDB connection closed.");
  }
};

// Run the seeder
runSeeder();
