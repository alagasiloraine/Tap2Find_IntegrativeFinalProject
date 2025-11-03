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
import { connectDB } from "./db.js";
import authRoutes from "./routes/authRoutes.js"; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use("/api/auth", authRoutes); 

export default app;

if (!process.env.ELECTRON) {
  app.listen(PORT, () =>
    console.log(`🔥 XianFire running at http://localhost:${PORT}`)
  );
}