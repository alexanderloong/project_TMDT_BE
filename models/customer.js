const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },

  password: {
    type: String,
    require: true,
  },

  name: {
    type: String,
    require: true,
  },

  phonenumber: {
    type: String,
    require: true,
  },

  address: {
    type: String,
    require: true,
  },

  createDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("customer", CustomerSchema);
