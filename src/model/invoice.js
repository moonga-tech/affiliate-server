const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: String
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  invoiceItems: {
    type: Array,
    required: true
  },
  invoiceStatus: {
    type: String,
    default: "UNPAID"
  },
  date: {
    type: Date,
    default: Date.now
  },
  payer: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Invoice", invoiceSchema);
