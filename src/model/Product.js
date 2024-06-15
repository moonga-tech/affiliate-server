const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    default: ""
  },
  productImage: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  sizesWanted: {
    type: String,
    required: true
  },
  alternativeSizes: {
    type: String,
    default: ""
  },
  creator: {
    type: String,
    required: true
  },
  price: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Products", productSchema);
