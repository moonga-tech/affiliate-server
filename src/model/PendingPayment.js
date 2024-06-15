const mongoose = require('mongoose');

const pendingPaymentSchema = new mongoose.Schema({
txnId: {

    type: String,
    required: true,
},amount:{

    type: Number,
    required: true,

},provider:{

    type: Number,
    required: true,

},sender:{
    type: String,
    required: true,

},receiver:{
    type: String,
    required: true,
    
},date:{

    type:Date,
    default: Date.now
},status:{

    type:String,
    default: 'PENDING',


},transactionType:{

        type:String,
        required: true,
},referrence:{

        type:String,
        default: "",
    
    }




});

module.exports = mongoose.model('PendingPayment', pendingPaymentSchema );