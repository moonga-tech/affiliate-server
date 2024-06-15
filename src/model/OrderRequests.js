const mongoose = require('mongoose');

const orderRequestSchema = new mongoose.Schema({
sender: {

    type: String,
    required: true,

},receiver: {

    type: String,
    required: true,

},products:{

    type: Array,
    required: true,

},date:{

    type:Date,
    default: Date.now
}


});

module.exports = mongoose.model('Order', orderRequestSchema);