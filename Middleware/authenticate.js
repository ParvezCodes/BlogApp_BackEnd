import jwt from "jsonwebtoken";
import { Post } from "../Models/Post.js";

export const authenticate = (req, res, next) => {
  // Get token from header, query, or cookies
  // const token = req.headers.authorization?.split(" ")[1];
  const token = req.cookies.token;

  console.log(token);

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized User" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { ...decode, userId: decode.id };
    next();
  } catch (error) {
    res.status(401).json({ msg: "Unauthorized: Invalid Token", error });
  }
};

export const authorizePostOwner = async (req, res, next) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ msg: "User not authorized" });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: "An error occurred", error: error.message });
  }
};
