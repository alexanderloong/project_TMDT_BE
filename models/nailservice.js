const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NailServiceSchema = new Schema({
  nameService: {
    type: String,
    unique: true,
  },

  priceService: Number,

  typeService: String,

  createDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("NailService", NailServiceSchema);
