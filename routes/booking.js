// dotenv
require("dotenv").config();

// Import modules
const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const axios = require("axios");
const verifyToken = require("../middleware/authToken");

const CryptoJS = require("crypto-js");
const HMAC256 = CryptoJS.HmacSHA256;
const encToHex = CryptoJS.enc.Hex.stringify;

const booking = require("../models/booking");

// @route POST api/booking
// @desc Post Booking detail
// @access private
router.post("/", verifyToken, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
    });

    await newBooking.save();

    res.status(200).json({
      success: true,
      message: "Booking has been recorded",
      newBooking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/booking/payment
// @desc Payment online
// @access private
router.post("/payment", verifyToken, async (req, res) => {
  // Reset order
  await axios.delete(
    `http://localhost:5000/api/booking/deletebook/${req.body._id}/${req.body.username}`
  );

  delete req.body._id;

  const newBooking = new Booking({
    ...req.body,
  });
  await newBooking.save();

  // Make signature
  const makeSignature = `partnerCode=${process.env.MOMO_PARTNER_CODE}&accessKey=${process.env.MOMO_ACCESS_KEY}&requestId=${newBooking._id}&amount=${newBooking.totalPrice}&orderId=${newBooking._id}&orderInfo=${newBooking.username}&returnUrl=http://localhost:3000/managementbooking&notifyUrl=http://localhost:5000/api/booking/payment/response/&extraData=ahihi`;

  let signature = HMAC256(makeSignature, process.env.MOMO_SECRET_KEY);

  signature = encToHex(signature);

  let reqMomo = {
    partnerCode: `${process.env.MOMO_PARTNER_CODE}`,
    accessKey: `${process.env.MOMO_ACCESS_KEY}`,
    requestId: `${newBooking._id}`,
    amount: `${newBooking.totalPrice}`,
    orderId: `${newBooking._id}`,
    orderInfo: `${newBooking.username}`,
    returnUrl: "http://localhost:3000/managementbooking",
    notifyUrl: "http://localhost:5000/api/booking/payment/response/",
    extraData: "ahihi",
    requestType: "captureMoMoWallet",
    signature: `${signature}`,
  };

  const response = await axios.post(
    `https://test-payment.momo.vn/gw_payment/transactionProcessor`,
    reqMomo
  );

  res.json(response.data);

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/booking/payment/response
// @desc Update response from Momo
// @access public
router.put("/payment/response/:id", async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id },
      { statusPayment: true },
      { new: true }
    );
    res.status(200).json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/booking/getbook
// @desc Get booking
// @access private
router.post("/getbook", verifyToken, async (req, res) => {
  try {
    let listBook;
    if (req.body.username === undefined) listBook = await Booking.find();
    else listBook = await Booking.find({ username: req.body.username });

    res.status(200).json(listBook);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/booking/deletebook
// @desc Delete booking
// @access private
router.delete("/deletebook/:id/:username", async (req, res) => {
  const bookingDeleteCondition = {
    _id: req.params.id,
    username: req.params.username,
  };

  try {
    const deletedBooking = await Booking.findOneAndDelete(
      bookingDeleteCondition
    );

    // User not authorised or booking not found
    if (!deletedBooking)
      return res.status(401).json({
        success: false,
        message: "booking not found or user not authorised",
      });

    res.json({ success: true, booking: deletedBooking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
