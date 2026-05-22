const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const MenuItem = require("../models/MenuItem");
const { protect, staffOrAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// GET /api/menu — public, list all available menu items
router.get("/", async (req, res) => {
  try {
    const { category, bestSeller } = req.query;
    const filter = { isAvailable: true };
    if (category) filter.category = category;
    if (bestSeller === "true") filter.isBestSeller = true;

    const items = await MenuItem.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// GET /api/menu/all — admin: includes unavailable items
router.get("/all", protect, staffOrAdmin, async (req, res) => {
  try {
    const items = await MenuItem.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// POST /api/menu — create new menu item (with optional photo)
router.post("/", protect, staffOrAdmin, upload.single("photo"), async (req, res) => {
  try {
    const { name, description, price, variations, category, isBestSeller, isAvailable } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required." });
    }

    // Parse variations from JSON string (FormData sends it as string)
    let parsedVariations = [];
    if (variations) {
      try {
        parsedVariations = JSON.parse(variations);
      } catch {
        return res.status(400).json({ message: "Invalid variations format." });
      }
    }

    // Validate: must have either a flat price or at least one variation
    if (parsedVariations.length === 0 && (price === undefined || price === null || price === "")) {
      return res.status(400).json({ message: "Provide a price or at least one variation." });
    }

    // If bestseller count is maxed at 4, block additional
    if (isBestSeller === "true" || isBestSeller === true) {
      const count = await MenuItem.countDocuments({ isBestSeller: true });
      if (count >= 4) {
        return res.status(400).json({ message: "Maximum 4 best sellers allowed. Unmark one first." });
      }
    }

    const item = await MenuItem.create({
      name,
      description,
      price: parsedVariations.length > 0 ? null : Number(price),
      variations: parsedVariations,
      category,
      photo: req.file ? req.file.filename : null,
      isBestSeller: isBestSeller === "true" || isBestSeller === true,
      isAvailable: isAvailable !== "false" && isAvailable !== false,
    });

    const populated = await item.populate("category", "name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// PUT /api/menu/:id — update menu item
router.put("/:id", protect, staffOrAdmin, upload.single("photo"), async (req, res) => {
  try {
    const { name, description, price, variations, category, isBestSeller, isAvailable } = req.body;

    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found." });

    let parsedVariations = item.variations;
    if (variations !== undefined) {
      try {
        parsedVariations = JSON.parse(variations);
      } catch {
        return res.status(400).json({ message: "Invalid variations format." });
      }
    }

    // Best seller cap check (only if enabling)
    const newBestSeller = isBestSeller === "true" || isBestSeller === true;
    if (newBestSeller && !item.isBestSeller) {
      const count = await MenuItem.countDocuments({ isBestSeller: true });
      if (count >= 4) {
        return res.status(400).json({ message: "Maximum 4 best sellers allowed. Unmark one first." });
      }
    }

    // If new photo uploaded, delete old one
    if (req.file && item.photo) {
      const oldPath = path.join(__dirname, "../uploads", item.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    item.name = name || item.name;
    item.description = description !== undefined ? description : item.description;
    item.category = category || item.category;
    item.variations = parsedVariations;
    item.price = parsedVariations.length > 0 ? null : (price !== undefined ? Number(price) : item.price);
    item.isBestSeller = newBestSeller;
    item.isAvailable = isAvailable !== "false" && isAvailable !== false;
    if (req.file) item.photo = req.file.filename;

    await item.save();
    const populated = await item.populate("category", "name");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// DELETE /api/menu/:id — delete menu item
router.delete("/:id", protect, staffOrAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found." });

    // Delete photo file if exists
    if (item.photo) {
      const filePath = path.join(__dirname, "../uploads", item.photo);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await item.deleteOne();
    res.json({ message: "Menu item deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;
