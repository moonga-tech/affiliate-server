const axios = require("axios");
const PendingPayments = require("../../model/PendingPayment");
const SucessfulTransaction = require("../../model/SucessfulTransaction");
const FailedTransaction = require("../../model/FailedTransaction");
function initiate_Momo_Disbursement(uniqueId, req, res) {
    require("dotenv").config;

    //PENDING PAYMENT OBJECT
  const payment = new PendingPayments({
    txnId: uniqueId,
    amount: req.body.amount,
    sender: req.body.sender,
    receiver: req.body.receiver,
    provider: req.body.provider,
    transactionType: "DISBURSEMENT"
  });

  //GENERATE TOKEN MOMO
  var session_url = "https://proxy.momoapi.mtn.com/disbursement/token/";

  var uname = process.env.MOMO_USER_NAME_DISBURSEMENT_ACCOUNT;
  var pass = process.env.MOMO_PASSWORD_DISBURSEMENT_ACCOUNT;
  const sub_key = process.env.SUB_KEY_DISBURSEMENT_ACCOUNT;

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
    .then(async Response => {
      //console.log(Response.data);
      const access_token = Response.data.access_token;

      //PAYMENT REQUEST MOMO

      const paymentRequest = {
        amount: req.body.amount,
        currency: "ZMW",
        externalId: uniqueId,
        payee: {
          partyIdType: "MSISDN",
          partyId: req.body.sender
        },
        payerMessage: `from zatu wallet sender: ${req.body.receiver}`
      };

      var session_url =
        "https://proxy.momoapi.mtn.com/disbursement/v1_0/transfer";

      const transfer_response = await axios.post(session_url, paymentRequest, {
        headers: {
          "Content-Type": "application/json",
          "X-Reference-Id": uniqueId,
          "X-Target-Environment": "mtnzambia",
          // "X-Callback-Url":
          //   "http://www.zatuwallet.com/api/v1/callback/transfer",

          "Ocp-Apim-Subscription-Key": sub_key,
         " Authorization" : "Bearer " + access_token
        }
      });

      console.log(transfer_response);
      return transfer_response;
    })
    .then(response => {
      console.log(response.status);
      console.log("MoMo transfer successfully initiated");

      return response;
    })
    .then(async (response) => {
      //GENERATE TOKEN MOMO
      var session_url_ = "https://proxy.momoapi.mtn.com/disbursement/token/";

      var uname = process.env.MOMO_USER_NAME_DISBURSEMENT_ACCOUNT;
      var pass = process.env.MOMO_PASSWORD_DISBURSEMENT_ACCOUNT;
      const sub_key = process.env.SUB_KEY_DISBURSEMENT_ACCOUNT;

      const token = await axios.post(
        session_url_,
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
      );

      var session_url = `https://proxy.momoapi.mtn.com/disbursement/v1_0/transfer/${uniqueId}`;

      const transfer_status = await axios.get(session_url, {
        headers: {
          "X-Target-Environment": "mtnzambia",

          "Ocp-Apim-Subscription-Key": sub_key,
          Authorization: "Bearer " + token.data.access_token
        }
      });

      //console.log(kadi);

      return transfer_status;
    })
    .then( async(Response) => {
      //console.log(Response);
      if (Response.status != 202) {
        console.log("Transaction failed: FAILED TRANSFER");
      }
     await payment.save();
      return Response;
    })
    .then(async response => {
      res.status(202).json({
        message: "MoMo transfer successfully initiated",
        id: uniqueId
      });
    })
    .catch(error => {
      res.status(500).json({ message: "Transaction failed" });

      //console.log(error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}


module.exports = initiate_Momo_Disbursement;
