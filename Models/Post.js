import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must be at least 10 characters long"],
    },
    photo: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: {
      type: [String], // Array of strings to hold multiple categories
      default: [],
    },
  },
  { timestamps: true }
);

// Add indexing
PostSchema.index({ userId: 1 });
PostSchema.index({ username: 1 });

export const Post = mongoose.model("Post", PostSchema);
