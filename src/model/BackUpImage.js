const mongoose = require("mongoose");

const backupImageSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  base64image: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Backupimages", backupImageSchema);
