const mongoose = require("mongoose");


const generatedLinkSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("GeneratedLink", generatedLinkSchema);
