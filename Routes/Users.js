import express from "express";
import { User } from "../Models/User.js";
import { authenticate } from "../Middleware/authenticate.js";
import { validateUserUpdate } from "../Middleware/inputValidation.js";
import bcrypt from "bcrypt";
import { Post } from "../Models/Post.js";

const router = express.Router();

// UPDATE USER
router.put("/:id", authenticate, validateUserUpdate, async (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  try {
    let updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      updateFields.password = hashedPass;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User Updated", updatedUser });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

// DELETE USER
router.delete("/:id", authenticate, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not find" });
    }

    await User.findByIdAndDelete(userId);
    await Post.deleteMany({ userId: req.params.id });
    await Comment.deleteMany({ userId: req.params.id });

    res.clearCookie("token");

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

// GET USER
router.get("/:id", authenticate, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

export default router;
