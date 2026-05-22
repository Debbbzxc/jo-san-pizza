const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { protect, staffOrAdmin } = require("../middleware/auth");

// GET /api/categories — public, list all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// POST /api/categories — staff/admin only
router.post("/", protect, staffOrAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required." });

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) return res.status(409).json({ message: "Category already exists." });

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// PUT /api/categories/:id — staff/admin only
router.put("/:id", protect, staffOrAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found." });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// DELETE /api/categories/:id — staff/admin only
router.delete("/:id", protect, staffOrAdmin, async (req, res) => {
  try {
    const MenuItem = require("../models/MenuItem");
    const itemCount = await MenuItem.countDocuments({ category: req.params.id });
    if (itemCount > 0) {
      return res.status(400).json({
        message: `Cannot delete: ${itemCount} menu item(s) use this category. Reassign them first.`,
      });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });
    res.json({ message: "Category deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;
