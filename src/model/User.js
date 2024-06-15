const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  pool: {
    type: Number,
    default: 0
  },
  holdingAccount: {
    type: Number,
    default: 0
  },
  interestRate: {
    type: Number,
    default: 0
  },
  channel: {
    type: String,
    default: ""
  },
  creditScore: {
    type: Number,
    default: 0.1
  },
  creditLimit: {
    type: Number,
    default: 100
  },
  date: {
    type: Date,
    default: Date.now
  },
  accountStatus: {
    type: String,
    default: "DOMANT"
  },
  shopName: {
    type: String,
    default: ""
  },
  profilePicture: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User", userSchema);
