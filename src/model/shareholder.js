const mongoose = require("mongoose");

const shareholderSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ""
  },

  shares: {
    type: Number,
    required: true
  },
  debttoCompany: {
    type: Number,
    default: 0
  },  monthsElapsed: {
    type: Number,
    default: 0
  },
  debttoShareholder: {
    type: Number,
    default: 0
  },
  interesttoCompany: {
    type: Number,
    default: 0
  },
  interesttoShareholder: {
    type: Number,
    default: 0
  },

  date: {
    type: Date,
    default: Date.now
  },
  accountStatus: {
    type: String,
    default: "DOMANT"
  },
  profilePicture: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Shareholders", shareholderSchema);
