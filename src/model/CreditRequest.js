const mongoose = require("mongoose");

const creditRequestSchema = new mongoose.Schema({
  creditor: {
    type: String,
    required: true
  },

  payDate: {
    type: String,
    required: true
  },
  transactionReference: {
    type: Array
  },
  balance: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  insurance: {
    type: Array
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CreditRequest", creditRequestSchema);
