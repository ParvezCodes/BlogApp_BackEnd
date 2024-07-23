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

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comment", commentRouter);

app.post("/api/upload", upload.single("file"), function (req, res) { // Changed key to "file"
  cloudinary.uploader.upload(req.file.path, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error",
      });
    }

    res.status(200).json({
      success: true,
      message: "Uploaded!",
      data: result.url, // Ensure URL is returned
    });
  });
});

// Test route
app.get("/", (req, res) => {
  res.json({ success: true });
});
