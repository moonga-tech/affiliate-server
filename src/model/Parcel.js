const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
  senderphoneNumber: {
    type: String,
    required: true
  },
  receiverphoneNumber: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "Pending"
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Parcel", parcelSchema);
