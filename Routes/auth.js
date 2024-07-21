import express from "express";
import bcrypt from "bcrypt";
import { User } from "../Models/User.js";
import jwt from "jsonwebtoken";
import {
  validateLogin,
  validateRegister,
} from "../Middleware/inputValidation.js";

const router = express.Router();

// REGISTER
router.post(
  "/register",
  validateRegister,

  async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      const user = new User({ username, email, password: hashedPass });
      const SavedUser = user.save();

      return res.status(200).json({ msg: "User Created Successfully", user });
    } catch (error) {
      res.status(500).json({ msg: "Internal Server Error", error });
    }
  }
);

// LOGIN
router.post("/login", validateLogin, async (req, res) => {
  const { email, password } = req.body;

  if (req.user) {
    return res.status(400).json({ msg: "User is already logged in" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong Credentials" });
    }

    // expire cookie in 1 day later
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      secure: true,
      sameSite: "Lax",
    });

    return res.status(200).json({ msg: "Login Successfully", user });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({ msg: "Logout Successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

//REFETCH USER
router.get("/refetch", (req, res) => {
  const token = req.cookies.token;

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
    if (err) {
      return res.status(404).json(err);
    }
    res.status(200).json(data);
  });
});

export default router;
