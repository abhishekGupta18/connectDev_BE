const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email id");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid photo url");
        }
      },
    },
    createdAt: {
      type: Date,
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("skills can not be more than 10");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
