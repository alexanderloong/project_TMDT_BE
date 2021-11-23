const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  date: Date,

  people: Number,
  time: String,
  service: Array,
  totalPrice: Number,

  username: String,

  typePayment: String,
  statusPayment: Boolean,

  statusBooking: Boolean,
  createDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("booking", BookingSchema);
