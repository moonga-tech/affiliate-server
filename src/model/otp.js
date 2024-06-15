const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
phoneNumber: {

    type: String,
    required: true,

},pin: {

    type: Number,
    required: true,

},date:{

    type:Date,
    default: Date.now
}


});

module.exports = mongoose.model('Otp', otpSchema);