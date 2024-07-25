import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./Routes/auth.js";
import userRouter from "./Routes/Users.js";
import postRouter from "./Routes/Posts.js";
import commentRouter from "./Routes/Comments.js";
import cloudinary from "./Data/cloudinary.js";
import upload from "./Middleware/multer.js";

export const app = express();

config(); 
const corsOptions = {
  origin: "https://blog-app-front-end-sigma.vercel.app",
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

app.post("/api/upload", upload.single("file"), function (req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  cloudinary.uploader
    .upload_stream({ resource_type: "auto" }, (err, result) => {
      if (err) {
        console.log("Cloudinary error:", err);
        return res.status(500).json({
          success: false,
          message: "Error uploading to Cloudinary",
          error: err.message, // Return the error message
        });
      }

      res.status(200).json({
        success: true,
        message: "Uploaded!",
        data: result.secure_url, // Ensure URL is returned
      });
    })
    .end(req.file.buffer); // Use req.file.buffer for in-memory storage
});

// Test route
app.get("/", (req, res) => {
  res.json({ success: true });
});
