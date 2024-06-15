const mongoose = require("mongoose");

const shopInvoiceSchema = new mongoose.Schema({
  salesAgent: {
    type: String,
    required: true
  },
  invoiceId: {
    type: String,
    required: true
  },
  invoiceItems: {
    type: Array,
    required: true
  },
  transactionType: {
    type: String,
    required: true
  },
  syncStatus: {
    type: Boolean,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ShopInvoices", shopInvoiceSchema);
