const mongoose = require("mongoose");

const fashionModelSchema = new mongoose.Schema({
  fullNames: {
    type: String,
    required: true
  },

  phoneNumber: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  shoeSize: {
    type: String,
    required: true
  },
  dressSize: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: ""
  },
  facebook: {
    type: String,
    default: ""
  },
  tiktok: {
    type: String,
    default: ""
  },
  instagram: {
    type: String,
    default: ""
  },
  profilePicture:{
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  },


});

module.exports = mongoose.model("FashionModel", fashionModelSchema);
