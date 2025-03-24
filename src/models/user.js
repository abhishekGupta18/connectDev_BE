const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcyrpt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
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

    age: {
      type: Number,
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

    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    organization: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    linkedlnUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid linkedln url");
        }
      },
    },
    twitterUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid X url");
        }
      },
    },
    projectUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid url");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);
// github, linkdln, twitter, projects link

// we need to use this keyword here so we can't use arrow function
userSchema.methods.getJwtToken = async function () {
  user = this;
  const token = await jwt.sign({ _id: user._id }, "abhi12703", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  user = this;
  const isPasswordValid = await bcyrpt.compare(
    passwordInputByUser,
    user.password
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
