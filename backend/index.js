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
import { createServer } from "http";
import { connectDB } from "./db.js";
import authRoutes from "./routes/authRoutes.js"; 
import dashboardRoutes from "./routes/dashboardRoutes.js";
import professorRoutes from "./routes/professorRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js";
import userSettingsRoutes from "./routes/userSettingsRoutes.js";
import rfidWebSocketServer from "./websocket.js";

import { updateSessionActivity } from './middleware/updateSessionActivity.js';

// Import the real-time service
import realtimeService from './services/realtimeService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server for WebSocket
const server = createServer(app);

await connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
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

// Initialize real-time service
realtimeService.initialize(server);

// Make services available to routes
app.set('rfidWebSocketServer', rfidWebSocketServer);
app.set('realtimeService', realtimeService);

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

// Start watching collections for real-time changes after routes are set up
app.use(async (req, res, next) => {
  // This ensures collections are watched after DB connection is established
  // and only once when the first request comes in
  if (!realtimeService.changeStreams || realtimeService.changeStreams.size === 0) {
    try {
      console.log('🔄 Starting real-time collection watchers...');
      
      // Watch collections you want real-time updates for
      await realtimeService.watchCollection('inquiries');
      await realtimeService.watchCollection('notifications');
      await realtimeService.watchCollection('notification_reads');
      await realtimeService.watchCollection('professor_schedules');
      await realtimeService.watchCollection('users');
      await realtimeService.watchCollection('user_sessions');
      await realtimeService.watchCollection('rfid_logs');
      // Add more collections as needed
      
      console.log('✅ All real-time collection watchers started');
    } catch (error) {
      console.error('❌ Error starting collection watchers:', error);
    }
  }
  next();
});

// Add WebSocket status endpoint for debugging
app.get('/api/websocket-status', (req, res) => {
  const realtimeClients = realtimeService.getClientCount ? realtimeService.getClientCount() : 0;
  
  res.json({
    success: true,
    data: {
      realtimeConnectedClients: realtimeClients,
      rfidConnectedClients: rfidWebSocketServer.getClientCount(),
      watchedCollections: realtimeService.changeStreams ? Array.from(realtimeService.changeStreams.keys()) : [],
      status: 'running'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'XianFires server is running',
    timestamp: new Date().toISOString(),
    services: {
      realtime: 'active',
      rfid: 'active',
      database: 'connected'
    }
  });
});

export default app;

if (!process.env.ELECTRON) {
  server.listen(PORT, () => {
    console.log(`🔥 XianFire running at http://localhost:${PORT}`);
    console.log(`🔌 RFID WebSocket available at ws://localhost:${PORT}/api/ws/rfid`);
    console.log(`🔌 Real-time Socket.io available at http://localhost:${PORT}`);
    console.log(`📊 Real-time status: http://localhost:${PORT}/api/websocket-status`);
  });
}