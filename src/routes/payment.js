const express = require("express");
require("dotenv").config();
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utilities/razorpay");

const PaymentModel = require("../models/payment");
const { membershipAmount } = require("../utilities/constant");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  const { membershipType } = req.body;
  const { firstName, lastName, email } = req.user;

  try {
    var options = {
      amount: membershipAmount[membershipType] * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: membershipType,
      },

      // notes is for ading meta data like user name, type of plan etc.
    };

    const order = await razorpayInstance.orders.create(options);

    const payment = new PaymentModel({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPaymentdetail = await payment.save();

    res.json({
      ...savedPaymentdetail.toJSON(),
      keyId: process.env.Razorpay_key_id,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e.message });
  }
});

module.exports = paymentRouter;
