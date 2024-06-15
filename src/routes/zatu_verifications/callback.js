const router = require("express").Router();
const PendingPayments = require("../../model/PendingPayment");
const FailedTransaction = require("../../model/FailedTransaction");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
//EVENT EMITTER
const { myEmitter } = require("../streams/streams");
const bcryptjs = require("bcryptjs");

const axios = require("axios");
const SucessfulTransaction = require("../../model/SucessfulTransaction");

require("dotenv").config;

const momoFailed = {
  financialTransactionId: 3666020829,
  externalId: "d31e670c-7c46-4359-83ef-da635c694779",
  amount: 1,
  currency: "ZMW",
  payer: { partyIdType: "MSISDN", partyId: 260963274070 },
  payeeNote: "d31e670c-7c46-4359-83ef-da635c694779",
  status: "FAILED",
  reason: "INTERNAL_PROCESSING_ERROR"
};

//CALLBACK FOR DISBURSEMENT LEAVING ACCOUNT
router.post("/disbursements", verifyToken, async (req, res) => {
  const pendingPayments = await PendingPayments.find({
    txnId: req.body.externalId
  });

  console.log(req.body);

  if (req.body.status == "FAILED") {
    //FAILED TRANSACTION SYNTAX
    const failed = {
      financialTransactionId: "3666020829",
      externalId: "d31e670c-7c46-4359-83ef-da635c694779",
      amount: "1",
      currency: "ZMW",
      payer: { partyIdType: "MSISDN", partyId: "260963274070" },
      payeeNote: "d31e670c-7c46-4359-83ef-da635c694779",
      status: "FAILED",
      reason: "INTERNAL_PROCESSING_ERROR"
    };

    //CREATE FAILED TRANSACTION
    const failedTransaction = new FailedTransaction({
      txnId: req.body.externalId,
      amount: req.body.amount,
      sender: req.body.payer.partyId,
      receiver: req.body.payeeNote,
      provider: pendingPayments[0].provider,
      providertransactionId: req.body.financialTransactionId,
      status: "FAILED",
      transactionType: pendingPayments[0].transactionType,
      reason: req.body.reason
    });

    //SAVE FAILED TRANSACTION TO DATABASE
    failedTransaction
      .save()
      .then(response => console.log(response, "SUCCESSFULL PAYMENT SAVED"))
      .catch(error => console.log(error));

    //DELETE PENDING PAYMENT
    PendingPayments.findByIdAndDelete(pendingPayments[0]._id)
      .then(response => console.log(response, "PENDING PAYMENT DELETED"))
      .catch(error => console.log(error));

    console.log(failedTransaction);

    //SIGN RESULTS
    jwt.sign(
      req.body,
      process.env.SECRET_TOKEN,
      async (error, signatureResults) => {
        if (error) {
          console.log(error);
        } else {
          myEmitter.emit("momo_failed", signatureResults);
        }
      }
    );
  } else {
    
    //SUCCESSFUL TRANSACTION SYNTAX
    const sucessful = {
      body: {
        financialTransactionId: "3401481343",
        externalId: "12345",
        amount: "1",
        currency: "ZMW",
        payer: {
          partyIdType: "MSISDN",
          partyId: "260766352686"
        },
        payeeNote: "food",
        status: "SUCCESSFUL"
      }
    };

    //CREATE SUCCESSFUL TRANSACTION
    const sucessfulTransaction = new SucessfulTransaction({
      txnId: req.body.body.externalId,
      amount: req.body.body.amount,
      sender: req.body.body.payer.partyId,
      receiver: req.body.body.payeeNote,
      provider: pendingPayments[0].provider,
      providertransactionId: req.body.body.financialTransactionId,
      transactionType: pendingPayments[0].transactionType,
      status: "SUCCESSFUL"
    });

    const senderphoneNumber = req.body.body.payer.partyId;
    const transactionId = req.body.body.financialTransactionId;
    const totalAmount = req.body.body.amount;
    const externalId = req.body.body.externalId;

    const message = `Transaction sucessful. TxT ${transactionId}. You have received ZMW ${totalAmount} from MOMO account orderId: ${externalId}`;

    //SAVE SUCCESSFUL TRANSACTION TO DATABASE
    sucessfulTransaction
      .save()
      .then(response => console.log(response, "SUCCESSFULL PAYMENT SAVED"))
      .catch(error => console.log(error));

    //DELETE PENDING PAYMENT
    PendingPayments.findByIdAndDelete(pendingPayments[0]._id)
      .then(response => console.log(response, "PENDING PAYMENT DELETED"))
      .catch(error => console.log(error));

    //SEND CALLBACK MESSAGE.
    const zamtelKey = process.env.ZAMTEL_KEY;
    var session_url = `https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key/${zamtelKey}/contacts/26${senderphoneNumber}/senderId/ZatuWallet/message/${message}`;

    axios
      .get(session_url)
      .then(Response => {
        if (Response.status !== 202) {
          console.log("error sending sms");
        }
      })
      .catch(Error => {
        console.log(Error);
      });
    //SIGN RESULTS
    jwt.sign(
      req.body.body,
      process.env.SECRET_TOKEN,
      async (error, signatureResults) => {
        if (error) {
          console.log(error);
        } else {
          myEmitter.emit("momo_transfer_successful", signatureResults);
        }
      }
    );
  }
});

//CALLBACK FOR COLLECTION ENTERING ACCOUNT
router.post("/collections", verifyToken, async (req, res) => {
  if (typeof req.body.externalId != "undefined") {
    //check if transaction exists in database
    const pendingPayments = await PendingPayments.find({
      txnId: req.body.externalId
    });

    if (pendingPayments.length == 0) {
      console.log("Transaction ID and not found");
      return;
    }

    console.log(pendingPayments);
    console.log(req.body);
    if (req.body.status == "FAILED") {
      //FAILED TRANSACTION SYNTAX
      const failed = {
        financialTransactionId: "3666020829",
        externalId: "d31e670c-7c46-4359-83ef-da635c694779",
        amount: "1",
        currency: "ZMW",
        payer: { partyIdType: "MSISDN", partyId: "260963274070" },
        payeeNote: "d31e670c-7c46-4359-83ef-da635c694779",
        status: "FAILED",
        reason: "INTERNAL_PROCESSING_ERROR"
      };

      //CREATE TRANSACTION
      const failedTransaction = new FailedTransaction({
        txnId: req.body.externalId,
        amount: req.body.amount,
        sender: req.body.payer.partyId,
        receiver: req.body.payeeNote,
        provider: pendingPayments[0].provider,
        providertransactionId: req.body.financialTransactionId,
        status: "FAILED",
        transactionType: pendingPayments[0].transactionType,
        reason: req.body.reason
      });

      //SAVE FAILED TRANSACTION TO DATABASE
      failedTransaction
        .save()
        .then(response => console.log(response, "FAILED PAYMENT SAVED"))
        .catch(error => console.log(error));

      //DELETE PENDING PAYMENT
      PendingPayments.findByIdAndDelete(pendingPayments[0]._id)
        .then(response => console.log(response, "PENDING PAYMENT DELETED"))
        .catch(error => console.log(error));

        const eventObject = {

          eventChannel: k
        }

      //SIGN RESULTS
      jwt.sign(
        req.body,
        process.env.SECRET_TOKEN,
        async (error, signatureResults) => {
          if (error) {
            console.log(error);
          } else {
            myEmitter.emit("momo_failed", signatureResults);
          }
        }
      );
    }
  } else if (typeof req.body.body.externalId != "undefined") {
    if (req.body.body.status == "SUCCESSFUL") {
      //check if transaction exists in database
      const pendingPayments = await PendingPayments.find({
        txnId: req.body.body.externalId
      });

      if (pendingPayments.length == 0) {
        console.log("Transaction ID and not found");
        return;
      }

      console.log(pendingPayments);
      console.log(req.body);
      //SUCCESSFUL TRANSACTION SYNTAX

      const sucessful = {
        body: {
          financialTransactionId: "3401481343",
          externalId: "12345",
          amount: "1",
          currency: "ZMW",
          payer: {
            partyIdType: "MSISDN",
            partyId: "260766352686"
          },
          payeeNote: "food",
          status: "SUCCESSFUL"
        }
      };

      //CREATE TRANSACTION
      const sucessfulTransaction = new SucessfulTransaction({
        txnId: req.body.body.externalId,
        amount: req.body.body.amount,
        sender: req.body.body.payer.partyId,
        receiver: req.body.body.payeeNote,
        provider: pendingPayments[0].provider,
        providertransactionId: req.body.body.financialTransactionId,
        transactionType: pendingPayments[0].transactionType,
        status: "SUCCESSFUL"
      });

      const senderphoneNumber = req.body.body.payer.partyId;
      const transactionId = req.body.body.financialTransactionId;
      const totalAmount = req.body.body.amount;
      const externalId = req.body.body.externalId;

      const message = `Transaction sucessful. TxT ${transactionId}. You have received ZMW ${totalAmount} from MOMO account orderId: ${externalId}`;

      //SAVE SUCCESSFUL TRANSACTION TO DATABASE
      sucessfulTransaction
        .save()
        .then(response => console.log(response, "SUCCESSFULL PAYMENT SAVED"))
        .catch(error => console.log(error));

      //DELETE PENDING PAYMENT
      PendingPayments.findByIdAndDelete(req.body.externalId)
        .then(response => console.log(response, "PENDING PAYMENT DELETED"))
        .catch(error => console.log(error));

      //SEND CALLBACK MESSAGE
      const zamtelKey = process.env.ZAMTEL_KEY;
      var session_url = `https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key/${zamtelKey}/contacts/26${senderphoneNumber}/senderId/ZatuWallet/message/${message}`;

      axios
        .get(session_url)
        .then(Response => {
          if (Response.status !== 202) {
            console.log("error sending sms");
          }
        })
        .catch(Error => {
          console.log(Error);
        });

      //SIGN RESULTS
      jwt.sign(
        req.body.body,
        process.env.SECRET_TOKEN,
        async (error, signatureResults) => {
          if (error) {
            console.log(error);
          } else {
            myEmitter.emit("momo_successful", signatureResults);
          }
        }
      );
    }
  }
});

//ACKNOWLEDGE MESSAGE
function verifyToken(req, res, next) {
  console.log("callback hit");
  res.status(200).json({ message: "call back successful" });

  next();
}

module.exports = router;
