import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config(); // Adjust path as necessary

console.log("env :", process.env.CLOUDINARY_API_KEY);
console.log("env :", process.env.CLOUDINARY_API_SECRET);
console.log("env :", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
