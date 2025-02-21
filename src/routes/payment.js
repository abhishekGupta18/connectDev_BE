const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utilities/razorpay");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    var options = {
      amount: 50000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      receipt: "receipt#1",
      notes: {},

      // notes is for ading meta data like user name, type of plan etc.
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ order });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e.message });
  }
});

module.exports = paymentRouter;
