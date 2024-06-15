const mongoose = require("mongoose");

const sucessfulTransactionSchema = new mongoose.Schema({
  txnId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
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
  provider: {
    type: Number,
    required: true
  },
  providertransactionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  transactionType: {
    type: String,
    required: true
  },
  referrence: {
    type: Array,
    default:[]
  },
  smsCount: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "SucessfulTransactionSchema",
  sucessfulTransactionSchema
);
