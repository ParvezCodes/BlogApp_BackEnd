import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRouter from "./Routes/auth.js";
import userRouter from "./Routes/Users.js";
import postRouter from "./Routes/Posts.js";
import commentRouter from "./Routes/Comments.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get the current module URL and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rate Limiter: Limits the number of requests from the same device
// const limiter = rateLimit({
//   windowMs: 2 * 60 * 1000, // 2 minutes window
//   max: 500, // Limit each IP to 500 requests per windowMs
//   message: "Too many requests, please try again after 5 minutes", // Message sent when rate limit is exceeded
// });

export const app = express();

config({
  path: "./Data/.env",
});

const corsOptions = {
  origin: "https://blog-app-front-end-nine.vercel.app",
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
// app.use(limiter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comment", commentRouter);

// Serve static files (images)
// app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "images");
    console.log("Saving file to:", uploadPath); // Debugging log
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Example route to handle file upload
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      // throw new Error("No file received");
      res.status(500).json({ msg: "No file received" });
    }
    // File uploaded successfully
    res.status(200).json({
      message: "File uploaded successfully!",
      filename: req.file.filename,
    });
  } catch (error) {
    // Handle file upload error
    console.error("File upload failed:", error.message);
    res
      .status(500)
      .json({ message: "File upload failed!", error: error.message });
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({ success: true });
});
