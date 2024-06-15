const mongoose = require("mongoose");

const BadloansSchema = new mongoose.Schema({
  borrower: {
    type: String,
    required: true
  },

  creditor: {
    type: Number,
    required: true
  },

  defaultTimes: {
    type: Array,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Badloans", BadloansSchema);
