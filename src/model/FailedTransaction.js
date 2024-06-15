const mongoose = require("mongoose");

const failedTransactionSchema = new mongoose.Schema({
  txnId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  provider: {
    type: Number,
    required: true
  },
  providertransactionId: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true
  },
  transactionType: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  smsCount: {
    type: Number,
    default: 0
  },
  referrence: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("FailedTransaction", failedTransactionSchema);
