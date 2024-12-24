const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const dataToBeSend = ["firstName", "lastName", "photoUrl", "about", "skills"];

// get all the pending requests for the loggedIn user

userRouter.get("/user/requests/recevied", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", dataToBeSend); // we can also write required fields in string as well

    const data = connectionRequests.map((req) => req.fromUserId);

    res.json({
      message: "data fetched successfully",
      data: data,
    });
  } catch (e) {
    res.status(400).send("ERROR: " + e);
  }
});

// get all the connection for the loggedIn user

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const userConnections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", dataToBeSend)
      .populate("toUserId", dataToBeSend);

    console.log(userConnections);

    const data = userConnections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({
      data,
    });
  } catch (e) {
    res.status(400).send("ERROR: " + e);
  }
});

// feed api

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId);
      hideUserFromFeed.add(req.toUserId);
    });

    const userFeed = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUserFromFeed) },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    }).select(dataToBeSend); // have to implement pagination using skip() and limit() functions

    res.send(userFeed);
  } catch (e) {
    res.status(400).send("ERROR: " + e);
  }
});

module.exports = userRouter;
