// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: null,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: "profile_default.png",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Note: Fixed the model name from "User" to "Product"
module.exports = mongoose.model("Product", productSchema);
