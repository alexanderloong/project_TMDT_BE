// dotenv
require("dotenv").config();

// Import modules
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");

const CryptoJS = require("crypto-js");
const SHA256 = CryptoJS.SHA256;
const encToHex = CryptoJS.enc.Hex.stringify;

const verifyToken = require("../middleware/authToken");

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await Customer.findById(req.body.userID).select("-password");

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/auth/register
// @desc Register user
// @access Public

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });

  try {
    // Check for existing customer
    const customer = await Customer.findOne({ username });

    if (customer)
      return res
        .status(400)
        .json({ success: false, message: "Username is already!" });

    // All good
    const hashPass = await SHA256(password);

    const newCustomer = new Customer({
      ...req.body,
      username,
      password: hashPass,
    });

    await newCustomer.save();

    // Return token
    const accessToken = jwt.sign(
      { userID: newCustomer._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });

  try {
    // Check for existing customer
    const customer = await Customer.findOne({ username });

    if (!customer)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password!" });

    // Check password
    const passValid =
      (await encToHex(SHA256(req.body.password))) === customer.password;

    if (!passValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password!" });
    // All good
    // Return token
    const accessToken = jwt.sign(
      { userID: customer._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "Log in succesfully!",
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
