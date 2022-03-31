const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: {
        values: ["Mr", "Mrs", "Miss"],
        message: "{VALUE} is not supported",
      },
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 15,
    },
    address: {
      street: { type: String, trim: true, required: true },
      city: { type: String, trim: true, required: true },
      pincode: { type: String, trim: true, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
