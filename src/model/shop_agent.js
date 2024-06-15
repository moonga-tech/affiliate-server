const mongoose = require("mongoose");

const shopAgentSchema = new mongoose.Schema({
  agentphoneNumber: {
    type: String,
    required: true
  },
  shopownerphoneNumber: {
    type: String,
    required: true
  },

  points: {
    type: Number,
    default: 50
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ShopAgents", shopAgentSchema);
