require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("please login");
    }
    const decodedData = await jwt.verify(token, process.env.jwt_token_secret);
    const { _id } = decodedData;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("user not found !!");
    } else {
      req.user = user;
      next();
    }
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
};

module.exports = { userAuth };
