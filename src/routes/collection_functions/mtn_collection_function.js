const axios = require("axios");
const PendingPayments = require("../../model/PendingPayment");
require("dotenv").config;
function initiate_Momo_Collection(uniqueId, req, res) {

    //PENDING PAYMENT OBJECT
    const payment = new PendingPayments({
      txnId: uniqueId,
      amount: req.body.amount,
      sender: req.body.sender,
      receiver: req.body.receiver,
      provider: req.body.provider,
      transactionType:"COLLECTION"
    });
  
  //GENERATE TOKEN MOMO
  var session_url = "https://proxy.momoapi.mtn.com/collection/token/";

  var uname = process.env.MOMO_USER_NAME_COLLECTION_ACCOUNT;
  var pass = process.env.MOMO_PASSWORD_COLLECTION_ACCOUNT;
  const sub_key = process.env.SUB_KEY_COLLECTION_ACCOUNT;

  axios
    .post(
      session_url,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": sub_key
        },
        auth: {
          username: uname,
          password: pass
        }
      }
    )
    .then(Response => {
      let access_token = Response.data.access_token;

      console.log("Token from MTN sucessfully fetched");

      const paymentRequest = {
        amount: req.body.amount,
        currency: "ZMW",
        externalId: uniqueId,
        payer: {
          partyIdType: "MSISDN",
          partyId: `26${req.body.sender}`
        }
      };

      var session_url =
        "https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay";

      axios.post(session_url, paymentRequest, {
        headers: {
          "Content-Type": "application/json",
          "X-Callback-Url":
            "https://zatuwallet-api.onrender.com/api/v1/callback/momo",
          "X-Reference-Id": uniqueId,
          "X-Target-Environment": "mtnzambia",

          "Ocp-Apim-Subscription-Key": sub_key,
          Authorization: "Bearer " + access_token
        }
      });
    })
    .then(response =>
      res.status(200).json({ message: response, txnId: uniqueId })
    )
    .then(async () => {

      await payment.save();
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ message: "Fatal error occured" });
    });
}

module.exports = initiate_Momo_Collection;
