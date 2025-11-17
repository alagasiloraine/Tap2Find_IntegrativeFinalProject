// import express from "express";
// import path from "path";
// import session from "express-session";
// import flash from "connect-flash";
// import fs from "fs";
// import hbs from "hbs";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import dotenv from "dotenv";
// import cors from "cors";
// import { connectDB } from "./db.js";
// import authRoutes from "./routes/authRoutes.js"; 
// import dashboardRoutes from "./routes/dashboardRoutes.js";
// import professorRoutes from "./routes/professorRoutes.js";
// import inquiryRoutes from "./routes/inquiryRoutes.js";
// import notificationRoutes from "./routes/notificationRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js"
// import attendanceRoutes from "./routes/attendanceRoutes.js";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 3000;


// await connectDB();

// app.use(cors());
// // Allow larger JSON/urlencoded bodies (base64 adds ~33% overhead). 10MB images ≈ 13.3MB base64.
// app.use(express.json({ limit: '15mb' }));
// app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// app.use(express.static(path.join(process.cwd(), "public")));

// app.use(
//   session({
//     secret: "xianfire-secret-key",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(flash());

// app.engine("xian", async (filePath, options, callback) => {
//   try {
//     const originalPartialsDir = hbs.partialsDir;
//     hbs.partialsDir = path.join(__dirname, "views");

//     const result = await new Promise((resolve, reject) => {
//       hbs.__express(filePath, options, (err, html) => {
//         if (err) return reject(err);
//         resolve(html);
//       });
//     });

//     hbs.partialsDir = originalPartialsDir;
//     callback(null, result);
//   } catch (err) {
//     callback(err);
//   }
// });

// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash("success_msg");
//   res.locals.error_msg = req.flash("error_msg");
//   next();
// });

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "xian");

// const partialsDir = path.join(__dirname, "views/partials");
// fs.readdir(partialsDir, (err, files) => {
//   if (err) {
//     console.error("❌ Could not read partials directory:", err);
//     return;
//   }

//   files
//     .filter((file) => file.endsWith(".xian"))
//     .forEach((file) => {
//       const partialName = file.replace(".xian", "");
//       const fullPath = path.join(partialsDir, file);

//       fs.readFile(fullPath, "utf8", (err, content) => {
//         if (err) {
//           console.error(`❌ Failed to read partial: ${file}`, err);
//           return;
//         }
//         hbs.registerPartial(partialName, content);
//       });
//     });
// });

// app.use("/api/auth", authRoutes); 
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/professors", professorRoutes);
// app.use("/api/inquiries", inquiryRoutes);
// app.use("/api/notification", notificationRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/rfid", attendanceRoutes);

// export default app;

// if (!process.env.ELECTRON) {
//   app.listen(PORT, () =>
//     console.log(`🔥 XianFire running at http://localhost:${PORT}`)
//   );
// }

import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import fs from "fs";
import hbs from "hbs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http"; // Add this import
import { connectDB } from "./db.js";
import authRoutes from "./routes/authRoutes.js"; 
import dashboardRoutes from "./routes/dashboardRoutes.js";
import professorRoutes from "./routes/professorRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js";
import userSettingsRoutes from "./routes/userSettingsRoutes.js";
import rfidWebSocketServer from "./websocket.js"; // Add this import

import { updateSessionActivity } from './middleware/updateSessionActivity.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server for WebSocket
const server = createServer(app);

await connectDB();

app.use(cors());
// Allow larger JSON/urlencoded bodies (base64 adds ~33% overhead). 10MB images ≈ 13.3MB base64.
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use(express.static(path.join(process.cwd(), "public")));

app.use(
  session({
    secret: "xianfire-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.engine("xian", async (filePath, options, callback) => {
  try {
    const originalPartialsDir = hbs.partialsDir;
    hbs.partialsDir = path.join(__dirname, "views");

    const result = await new Promise((resolve, reject) => {
      hbs.__express(filePath, options, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    hbs.partialsDir = originalPartialsDir;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
});

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "xian");

const partialsDir = path.join(__dirname, "views/partials");
fs.readdir(partialsDir, (err, files) => {
  if (err) {
    console.error("❌ Could not read partials directory:", err);
    return;
  }

  files
    .filter((file) => file.endsWith(".xian"))
    .forEach((file) => {
      const partialName = file.replace(".xian", "");
      const fullPath = path.join(partialsDir, file);

      fs.readFile(fullPath, "utf8", (err, content) => {
        if (err) {
          console.error(`❌ Failed to read partial: ${file}`, err);
          return;
        }
        hbs.registerPartial(partialName, content);
      });
    });
});

// Make WebSocket server available to routes
app.set('rfidWebSocketServer', rfidWebSocketServer);

app.use("/api/auth", authRoutes); 
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rfid", attendanceRoutes);
app.use("/api/user-settings", userSettingsRoutes);

app.use('/api/user-settings', updateSessionActivity); 

// Initialize WebSocket server
rfidWebSocketServer.initialize(server);

// Add WebSocket status endpoint for debugging
app.get('/api/websocket-status', (req, res) => {
  res.json({
    success: true,
    data: {
      connectedClients: rfidWebSocketServer.getClientCount(),
      status: 'running'
    }
  });
});

export default app;

if (!process.env.ELECTRON) {
  server.listen(PORT, () => { // Change from app.listen to server.listen
    console.log(`🔥 XianFire running at http://localhost:${PORT}`);
    console.log(`🔌 RFID WebSocket available at ws://localhost:${PORT}/api/ws/rfid`);
  });
}