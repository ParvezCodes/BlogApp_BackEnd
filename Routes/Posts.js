import express from "express";
import { Post } from "../Models/Post.js";
import { Comment } from "../Models/Comment.js";
import {
  authenticate,
  authorizePostOwner,
} from "../Middleware/authenticate.js";

const router = express.Router();

// CREATE POST
router.post("/create", authenticate, async (req, res) => {
  const { title, desc, photo, username, categories } = req.body;
  const userId = req.user.userId;

  console.log("Received post data:", req.body);

  try {
    const newPost = new Post({
      title,
      desc,
      photo,
      username,
      userId,
      categories,
    });

    const savedPost = await newPost.save();
    console.log("Saved post:", savedPost);

    res.status(200).json({ msg: "Post is created", savedPost });
  } catch (error) {
    res.status(500).json({ msg: "some error occur", error });
  }
});

// UPDATE POST
router.put(
  "/update/:id",
  authenticate,
  authorizePostOwner,
  async (req, res) => {
    const postId = req.params.id;
    const { title, desc, photo, username, categories } = req.body;

    try {
      let post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      post.title = title;
      post.desc = desc;
      post.photo = req.body.photo || post.photo;
      post.username = username;
      post.categories = categories;

      const updatedPost = await post.save();

      res.status(200).json({ msg: "Post Updated", updatedPost });
    } catch (error) {
      res.status(500).json({ msg: "some error occur", error });
    }
  }
);

// DELETE POST
router.delete(
  "/delete/:id",
  authenticate,
  authorizePostOwner,
  async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      await Comment.deleteMany({ postId: req.params.id });
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }
      res.status(200).json({ message: "Post deleted successfully", post });
    } catch (error) {
      res.status(500).json({ msg: "Internal Server Error", error });
    }
  }
);

// GET POST DETAILS
router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ msg: "some error occur", error });
  }
});

// GET ALL POSTS OR SEARCH BY TITLE
router.get("/", async (req, res) => {
  const { title, username } = req.query;
  const query = {};

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 7;
  const skip = (page - 1) * limit;

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (username) {
    query.username = { $regex: username, $options: "i" };
  }

  try {
    const totalPosts = await Post.countDocuments(query); // Use the query here
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    res.status(200).json({ posts, total: totalPosts });
  } catch (error) {
    res.status(500).json({ msg: "Error retrieving posts", error });
  }
});


// GET USER POST
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ msg: "some error occur", error });
  }
});

export default router;
