const axios = require("axios");
const Credit_Requests = require("../../model/CreditRequest");
const smsFunction = require("../zatu_verifications/sms");
const User = require("../../model/User");

Collect_credit = async function() {

  //find and send payment reminders to clients with a balance
  const Credit_List = await Credit_Requests.find({balance: {$gt: 0}});

  //console.log("CREDIT TRIGGERED");

  if(Credit_List.length == 0) return;

  for (let i = 0; i < Credit_List.length; i++) {
    const user = await User.findById(Credit_List[i].userReference);
    const message = `hello, ${user.firstName} you have a pending balance of ZMW ${Credit_List[
      i
    ].balance}. Kindly clear it via the link to avoid penalty interest`;

    if(Credit_List[i].balance > 0) {

      console.log("CREDIT SMS TRIGGERED");

      //smsFunction(message, user.phoneNumber);
    }
  }
};

module.exports = Collect_credit;
