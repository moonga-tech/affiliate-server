const jwt = require("jsonwebtoken");
const router = require("express").Router();
const PendingPayments = require("../../model/PendingPayment");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const axios = require("axios");
const { setRandomFallback } = require("bcryptjs");
const Invoice = require("../../model/invoice");

require("dotenv").config;

router.post("/", async (req, res) => {
  console.log(req.body);

  const amount = req.body.totalAmount;
  const payer = req.body.payer;
  const sender = req.body.sender;
  const receiver = req.body.receiver;
  const provider = req.body.provider;
  const unique = uuidv4();

  const payment = new PendingPayments({
    txnId: unique,
    amount: amount,
    sender: sender,
    receiver: receiver,
    provider: provider,
    transactionType: "COLLECTION",
    referrence: req.body.orderId
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
        amount: amount,
        currency: "ZMW",
        externalId: unique,
        payer: {
          partyIdType: "MSISDN",
          partyId: `26${payer}`
        },
        payerMessage: req.body.orderId,
        payeeNote: req.body.orderId
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
          Authorization: "Bearer " + access_token
        }
      });
    })
    .then(() =>
      res
        .status(200)
        .json({ message: "transaction successfully initiated", txnId: unique })
    )
    .then(async () => {
      //SAVE PENDING PAYMENT
      await payment.save();

      //UPDATE INVOICE PAYER
      await Invoice.updateOne(
        {
          invoiceId: req.body.orderId
        },
        { $set: { payer: payer } }
      );
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ message: "Fatal error occured" });
    });
});

module.exports = router;
