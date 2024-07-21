import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
    },
    postId: {
      type: String,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", CommentSchema);
