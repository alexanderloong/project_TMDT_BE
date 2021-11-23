// Import modules
const express = require("express");
const router = express.Router();

const axios = require("axios");
const verifyToken = require("../middleware/authToken");

const Booking = require("../models/booking");
const Service = require("../models/nailservice");

// @route PUT api/manage/booking
// @desc Update status booking
// @access private
router.put("/booking/:id", async (req, res) => {
  try {
    const booked = await Booking.findOneAndUpdate(
      { _id: req.params.id },
      { statusBooking: true, statusPayment: true },
      { new: true }
    );

    if (!booked)
      return res.status(401).json({
        success: false,
        message: "booking not found or user not authorised",
      });

    res.status(200).json({ success: true, booked });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/manage/service
// @desc Post service
// @access private
router.post("/service", verifyToken, async (req, res) => {
  try {
    const newService = new Service({
      ...req.body,
    });

    await newService.save();

    res.status(200).json({
      success: true,
      message: "Service has been recorded",
      newService,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/manage/service
// @desc GET all service
// @access public
router.get("/service", async (req, res) => {
  try {
    const listService = await Service.find();

    if (!listService)
      return res.status(401).json({
        success: false,
        message: "Not have service!",
      });

    res.status(200).json({
      success: true,
      listService,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/manage/service
// @desc DELETE service
// @access private
router.delete("/service/:id", async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id });

    if (!service)
      return res.status(401).json({
        success: false,
        message: "Service not found!",
      });

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/manage/service/update
// @desc Update service
// @access private
router.post("/service/update", async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.body.id },
      { ...req.body },
      { useFindAndModify: false }
    );

    if (!service)
      return res.status(401).json({
        success: false,
        message: "Service not found!",
      });

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
