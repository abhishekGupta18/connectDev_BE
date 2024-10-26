const mongoose = require("mongoose");
const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.send("Invalid status");
      }

      if (fromUserId.equals(toUserId)) {
        throw new Error("can't send this request");
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("user not exist");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId: fromUserId,
            toUserId: toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(404).send("req alreay exist");
      }

      const newConnectionRequest = ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await newConnectionRequest.save();
      res.json({
        data: newConnectionRequest,
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
      });
    } catch (e) {
      res.send("something went wrong " + e);
    }
  }
);

module.exports = requestRouter;
