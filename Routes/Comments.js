import express from "express";
import { Comment } from "../Models/Comment.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

const validateComment = [
  body("comment").notEmpty().withMessage("Comment cannot be empty"),
];

// NEW COMMENT
router.post("/create", validateComment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const comment = new Comment(req.body);
    await comment.save();
    res.status(200).json({ msg: "Comment created", comment });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

// UPDATE COMMENT
router.put("/:id", async (req, res) => {
  const commentId = req.params.id;
  const { comment, author, userId, postId } = req.body;

  try {
    const newComment = await Comment.findById(commentId);

    if (!newComment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    newComment.comment = comment;
    newComment.author = author;
    newComment.userId = userId;
    newComment.postId = postId;

    const updatedComment = await newComment.save();

    res.status(200).json({ msg: "Comment Updated", updatedComment });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

// DELETE COMMENT
router.delete("/:id", async (req, res) => {
  const commetId = req.params.id;
  try {
    const comment = await Comment.findById(commetId);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    const deletedComment = await Comment.findByIdAndDelete(commetId);
    res.status(200).json({ msg: "Comment Deleted", deletedComment });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

// GET POST COMMENTS
router.get("/postcomments/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const comments = await Comment.find({ postId });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

export default router;
