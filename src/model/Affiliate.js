const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema({
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

  balance: {
    type: Number,
    default: 0
  },

  date: {
    type: Date,
    default: Date.now
  },

  profilePicture: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Affiliate", affiliateSchema);
