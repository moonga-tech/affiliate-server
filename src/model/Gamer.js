const mongoose = require("mongoose");

const gamerSchema = new mongoose.Schema({
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
  
 
  
  
  date: {
    type: Date,
    default: Date.now
  },


});

module.exports = mongoose.model("Gamers", gamerSchema);
