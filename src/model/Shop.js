const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  shopId: {
    type: String,
    required: true
  },
  products: {
    type: Array,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Shops", shopSchema);
