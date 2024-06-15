const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  status: {
    type: String,
    default: "UNPAID"
  },
  buyer: {
    type: String,
    required: true
  },
  seller: {
    type: String,
    required: true
  },

  productId: {
    type: String,
    required: true
  },
  productUrl: {
    type: String,
    default: ""
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  productSpecifications: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Cart", cartSchema);
