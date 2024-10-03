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
      trim: true,
      unique: true,
      lowerCase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("invaid gender type");
        }
      },
    },
    about: {
      type: String,
      default: "I am using devTinder",
    },
    photoUrl: {
      type: String,
      default:
        "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg",
    },
    createdAt: {
      type: date,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
