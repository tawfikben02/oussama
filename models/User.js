const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      default: null,
    },
    address: {
      type: String,
      required: false,
      default: null,
    },
    image: {
      type: String,
      required: false,
      default: "profile_default.png",
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client", // optional, but helpful
      required: true,
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

module.exports = mongoose.model("User", userSchema);
