const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

// All user management routes require admin
router.use(protect, adminOnly);

// GET /api/users — list all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// POST /api/users — create a new user
router.post("/", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: "Name, username, and password are required." });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, password: hashed, role: role || "staff" });

    res.status(201).json({
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// PUT /api/users/:id — update user (name, username, role, optional password)
router.put("/:id", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Check username uniqueness if changed
    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) return res.status(409).json({ message: "Username already taken." });
      user.username = username;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: "User updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// DELETE /api/users/:id — delete a user
router.delete("/:id", async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;
