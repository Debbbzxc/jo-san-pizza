const mongoose = require("mongoose");

// A variation is something like { label: "Solo", price: 100 }
const variationSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
});

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    // If variations exist, base price is the lowest variation price
    // If no variations, use this as the flat price
    price: { type: Number, min: 0, default: null },
    variations: [variationSchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    photo: { type: String, default: null }, // filename stored in /uploads
    isBestSeller: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual: the display price (lowest variation price, or flat price)
menuItemSchema.virtual("displayPrice").get(function () {
  if (this.variations && this.variations.length > 0) {
    return Math.min(...this.variations.map((v) => v.price));
  }
  return this.price;
});

menuItemSchema.set("toJSON", { virtuals: true });
menuItemSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("MenuItem", menuItemSchema);
