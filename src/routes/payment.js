const express = require("express");
require("dotenv").config();
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utilities/razorpay");
const PaymentModel = require("../models/payment");
const { membershipAmount } = require("../utilities/constant");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

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

paymentRouter.post("/payment/webhook", async (req, res) => {
  const webhookSignature = req.get("X-Razorpay-Signature");

  try {
    const isWebhookIsValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.Razorpay_webhook_secret
    ); // verifying payment using webhook

    if (!isWebhookIsValid) {
      return res.status(400).json({ msg: "Webhook is invalid" });
    }

    const paymentDetails = req.body.payload.payment.entity;
    console.log(paymentDetails);
    const payment = await PaymentModel.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    user.save();

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    return res.status(200).json({ msg: "webhook received successfully" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = paymentRouter;

// validateWebhookSignature(
//   JSON.stringify(webhookBody),  // webhookBody is nothing but req.body that come with post req
//   webhookSignature,
//   process.env.Razorpay_webhook_secret
// );
// When your webhook secret is set, Razorpay uses it to create a hash signature with each payload. This hash signature is passed with each request under the X-Razorpay-Signature header that you need to validate at your end.
