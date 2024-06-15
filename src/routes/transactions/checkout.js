const jwt = require("jsonwebtoken");
const router = require("express").Router();
const PendingPayments = require("../../model/PendingPayment");
const Otp = require("../../model/otp");
const mongoose = require("mongoose");
const axios = require("axios");
const { setRandomFallback } = require("bcryptjs");

require("dotenv").config;

router.post("/momo", async (req, res) => {
  console.log(req.body);

  const otpExist = await Otp.find({ otp: req.body.otp });

  if (!otpExist.length > 0)
    return res.status(400).json({ message: "OTP doesn't exist" });

  const unique = req.body.orderId;

  let access_token = {};

  const payment = new PendingPayments({

    txnId: req.body.orderId,
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
          "Ocp-Apim-Subscription-Key": sub_key,
        },
        auth: {
          username: uname,
          password: pass,
        },
      }
    )
    .then((Response) => {
      let access_token = Response.data.access_token;

      console.log("Token from MTN sucessfully fetched");

      const paymentRequest = {
        amount: req.body.totalAmount,
        currency: "ZMW",
        externalId: req.body.orderId,
        payer: {
          partyIdType: "MSISDN",
          partyId: req.body.sender,
        },
        payerMessage: req.body.orderId,
        payeeNote: req.body.orderId,
      };


  
      var session_url =
        "https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay";

      axios.post(session_url, paymentRequest, {
        headers: {
          "Content-Type": "application/json",
          "X-Callback-Url":
            "https://zatuwallet-api.onrender.com/api/v1/callback/momo",
          "X-Reference-Id": unique,
          "X-Target-Environment": "mtnzambia",

          "Ocp-Apim-Subscription-Key": sub_key,
          "Authorization" : "Bearer " + access_token,
        },
      });
    })
    .then(
      (Response) => res.status(200).json({ message: "transaction successfully initiated" })


    ).then(() => payment.save()
    ).catch((error) => {
      console.log(error);
      res.status(400).json({ message: "Fatal error occured" });
    });
});

module.exports = router;
