const mongoose = require("mongoose");

const shopProductSchema = new mongoose.Schema({
  shopId: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    required: true
  },
  sizesAvailable: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ShopProducts", shopProductSchema);
