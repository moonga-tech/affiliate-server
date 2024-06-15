const mongoose = require("mongoose");

const loansSchema = new mongoose.Schema({
  borrowerphoneNumber: {
    type: String,
    required: true
  },
  borrowerNames: {
    type: String,
    required: true
  },

  creditorphoneNumber: {
    type: String,
    required: true
  },
  creditorNames: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  transactionReference: {
    type: String,
    required: true
  },
  settlementtransactionReference: {
    type: String,
    default: ""
  },

  payDate: {
    type: Date,
    required: true
  },
  loanStatus: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Loans", loansSchema);
