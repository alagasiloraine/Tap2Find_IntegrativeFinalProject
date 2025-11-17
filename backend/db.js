// |= mongodb configuration local =|
// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/tap2find_db");
//     console.log("✅ MongoDB connected successfully!");
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };


// import { MongoClient, ServerApiVersion } from "mongodb";
// import dotenv from "dotenv";

// dotenv.config();

// const uri = process.env.MONGO_URI;

// if (!uri) {
//   console.error("❌ MONGO_URI is missing in .env file");
//   process.exit(1);
// }

// export const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// export const connectDB = async () => {
//   try {
//     await client.connect();

//     await client.db("admin").command({ ping: 1 });

//     console.log("✅ Connected to MongoDB Atlas successfully!");
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };

// export const getDB = (dbName = "tap2find_db") => client.db(dbName);

import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

// Create MongoDB client
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;

/**
 * Connects to MongoDB with automatic retry on failure.
 */
export const connectDB = async (retries = 10, delay = 3000) => {
  let attempt = 1;

  while (!isConnected && attempt <= retries) {
    try {
      console.log(`🔌 Attempting MongoDB connection (Attempt ${attempt}/${retries})...`);
      await client.connect();
      await client.db("admin").command({ ping: 1 });

      console.log("✅ Connected to MongoDB Atlas successfully!");
      isConnected = true;
      break;
    } catch (error) {
      console.error(`❌ MongoDB connection failed (Attempt ${attempt}): ${error.message}`);

      // If not last attempt, wait and retry
      if (attempt < retries) {
        const waitTime = delay * attempt; // exponential backoff
        console.log(`⏳ Retrying in ${waitTime / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        console.error("🚨 All retry attempts failed. Please check your internet connection or MongoDB URI.");
        process.exit(1);
      }

      attempt++;
    }
  }
};

/**
 * Returns the database instance.
 */
export const getDB = (dbName = "tap2find_db") => client.db(dbName);
