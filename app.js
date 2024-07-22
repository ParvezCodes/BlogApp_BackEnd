import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./Routes/auth.js";
import userRouter from "./Routes/Users.js";
import postRouter from "./Routes/Posts.js";
import commentRouter from "./Routes/Comments.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import { fileURLToPath } from "url";
import path from "path";

// Get the current module URL and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({
  path: "./Data/.env",
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const app = express();

const corsOptions = {
  origin: "https://blog-app-front-end-nine.vercel.app",
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comment", commentRouter);

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload route with Cloudinary integration
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No file received" });
  }

  const stream = Readable.from(req.file.buffer);
  const uploadStream = cloudinary.v2.uploader.upload_stream((error, result) => {
    if (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(500).json({ message: "Upload failed", error });
    }
    res.status(200).json({
      message: "File uploaded successfully!",
      url: result.secure_url,
    });
  });

  stream.pipe(uploadStream);
});

// Test route
app.get("/", (req, res) => {
  res.json({ success: true });
});