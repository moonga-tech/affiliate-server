//IMPORTS
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const axios = require("axios");
const { setRandomFallback } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const Cart = require("../../model/Cart");
const Loans = require("../../model/Loans");
const User = require("../../model/User");
const SucessfulTransaction = require("../../model/SucessfulTransaction");

//EVENT EMITTER
const { myEmitter } = require("../streams/streams");
const smsFunction = require("../zatu_verifications/sms");

require("dotenv").config;

//ZATU TRANSACTION: TRASFERS BETWEEN ZATU USERS
router.post("/", verifyToken, (req, res) => {
  console.log("zatu baby");
  const unique = uuidv4();

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      //GET SENDER DETAILS
      const senderDetails = await User.find({ phoneNumber: req.body.sender });
      console.log(senderDetails);

      //GET RECEIVER DETAILS
      const receiverDetails = await User.find({
        phoneNumber: req.body.receiver
      });
      console.log(receiverDetails);

      //CHECK IF SENDER (sending to own acccount)
      if (req.body.sender == req.body.receiver)
        return res.status(403).json({ message: "Operation not allowed" });

      //CHECK IF SENDER EXIST
      if (senderDetails.length == 0)
        return res.status(403).json({ message: "sender doesn't exists" });

      //CHECK IF RECEIVER EXIST
      if (receiverDetails.length == 0)
        return res.status(403).json({ message: "receiver doesn't exists" });

      const sender = senderDetails[0];
      const receiver = receiverDetails[0];

      //CHECK IF SENDER HAS ENOUGH FUNDS
      if (sender.balance <= req.body.amount)
        return res
          .status(403)
          .json({ message: "user doesn't have enough funds" });

      //TRANSACTION BETWEEN SENDER AND RECEIVER(update accounts)
      const senderRemaining = sender.balance - parseInt(req.body.amount);
      const receiverRemaining = receiver.balance + parseInt(req.body.amount);

      const senderTransfer = await User.updateOne(
        { phoneNumber: req.body.sender },
        { $set: { balance: senderRemaining } }
      );
      const receiverTransfer = await User.updateOne(
        { phoneNumber: req.body.receiver },
        { $set: { balance: receiverRemaining } }
      );

      //CREATE TRANSACTION
      const sucessfulTransaction = new SucessfulTransaction({
        txnId: unique,
        amount: req.body.amount,
        sender: req.body.sender,
        receiver: req.body.receiver,
        provider: 1,
        providertransactionId: unique,
        transactionType: "TRANSFER",
        status: "SUCCESSFUL"
      });

      //SAVE SUCCESSFUL TRANSACTION TO DATABASE
      const successfultransaction = await sucessfulTransaction.save();

      //PAYLOAD TO BE EMIITED
      const payload = {
        senderChannel: sender.channel,
        receiverChannel: receiver.channel,
        balance: unique
      };

      const message = `You have received ZMW ${req.body.amount} from ${req.body
        .sender} at ${successfultransaction.date}. TXT ID:${successfultransaction.txn}`;

      //SEND SMS TO RECEIVER
      smsFunction(message, req.body.receiver);

      //EMIT TRANSACTION
      myEmitter.emit("zatu_transfer", payload);

      res.status(200).json({
        message: "transaction sucesssfull",
        txn: unique,
        balance: senderRemaining
      });
    }
  });
});
//FETCH LOAN LIST
router.post("/credit/loans", verifyToken, (req, res) => {
  console.log("LOAN LIST", req.body);
  if (typeof req.body.phoneNumber == "undefined")
    return res.status(400).json({
      message: "phone number missing"
    });

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      //GET LOAN LIST
      const loan_list = await Loans.find({
        borrower: req.body.phoneNumber
      });

      return res.status(200).json({ message: loan_list });
    }
  });
});

//ZATU CREDIT PULL
router.post("/credit/borrow", verifyToken, (req, res) => {
  console.log("zatu crdit");
  if (
    typeof req.body.borrower == "undefined" ||
    typeof req.body.creditor == "undefined" ||
    typeof req.body.amount == "undefined"
  )
    return res.status(403).json({
      message: "Phone number or creditor phone number missing or amount"
    });

  //BORROWER NUMBER AND CREDITOR NUMBER ARE THE SAME
  if (req.body.borrower == req.body.creditor)
    return res.status(403).json({
      message: "Opertation not allowed"
    });
  if (Number(req.body.amount) < 0)
    return res.status(403).json({ message: "Amount can't be negative" });
  const unique = uuidv4();

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      //GET USER(Borrower) DETAILS
      const user_Details = await User.find({
        phoneNumber: req.body.borrower
      });
      console.log(user_Details);

      //GET CREDITOR DETAILS
      const creditor_Details = await User.find({
        phoneNumber: req.body.creditor
      });
      console.log(user_Details);

      //CHECK IF USER EXIST
      if (user_Details.length == 0)
        return res
          .status(403)
          .json({ message: "borrower doesn't exists in the system" });

      //CHECK IF  CREDITOR EXIST
      if (creditor_Details.length == 0)
        return res.status(403).json({ message: "credior doesn't exists" });

      //CALCULATE HOW MUCH TO CREDIT THE USER
      const amount_eligible_for_borrowing =
        user_Details[0].creditScore * user_Details[0].creditLimit;
      // console.log(
      //   "borrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
      //   amount_eligible_for_borrowing
      // );
      //check if borrower qualifies for the amount.
      if (amount_eligible_for_borrowing < req.body.amount)
        return res.status(403).json({
          message: `You qualify for ZMW ${amount_eligible_for_borrowing} and not ZMW ${req
            .body.amount}`
        });

      //check if creditor has enough cash in the pool
      if (creditor_Details[0].pool < amount_eligible_for_borrowing)
        return res.status(403).json({ message: "Cash reserves to low" });

      //TRANSACTION BETWEEN CREDITOR AND BORROWER(update accounts)
      const user_final_account =
        user_Details[0].balance + Number(req.body.amount);
      const creditor_final_pool_account =
        creditor_Details[0].pool - Number(req.body.amount);
      //CREATE TRANSACTION
      const sucessfulTransaction = new SucessfulTransaction({
        txnId: unique,
        amount: req.body.amount,
        sender: creditor_Details[0].phoneNumber,
        receiver: user_Details[0].phoneNumber,
        provider: 1,
        providertransactionId: unique,
        transactionType: "LOAN",
        status: "SUCCESSFUL"
      });
      const ts = Date.now();
      const date = new Date(ts);

      const payment_date = new Date();

      const final_date = payment_date.setDate(date.getDate() + 32);

      //calculate total amount to pay: amount borrowed + interest
      const credited_converted = creditor_Details[0].interestRate / 100;
      const interested_converted_to_cash =
        sucessfulTransaction.amount * credited_converted;
      const totalAmount_credited =
        sucessfulTransaction.amount + interested_converted_to_cash;

      //console.log("dateeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", final_date);
      const loans = new Loans({
        totalAmount: totalAmount_credited,
        transactionReference: sucessfulTransaction._id,
        borrowerphoneNumber: sucessfulTransaction.receiver,
        borrowerNames: `${user_Details[0].firstName} ${user_Details[0]
          .lastName}`,
        creditorphoneNumber: sucessfulTransaction.sender,
        creditorNames: `${creditor_Details[0].firstName} ${creditor_Details[0]
          .lastName}`,
        amount: sucessfulTransaction.amount,
        interestRate: creditor_Details[0].interestRate,
        loanStatus: "UNPAID",
        payDate: final_date
      });
      sucessfulTransaction
        .save()
        .then(async response => {
          //console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", response);
          const user_Transfer_result = await User.updateOne(
            { phoneNumber: user_Details[0].phoneNumber },
            { $set: { balance: user_final_account } }
          );

          console.log(user_Transfer_result);

          const creditor_Transfer_result = await User.updateOne(
            { phoneNumber: creditor_Details[0].phoneNumber },
            { $set: { pool: creditor_final_pool_account } }
          );
          const loan_save_results = await loans.save();
          console.log(creditor_Transfer_result);

          const message = `Your account has been credited with ZMW ${req.body
            .amount} at ${sucessfulTransaction.date}. TXT ID:${sucessfulTransaction.txnId}`;
          //PAYLOAD TO BE EMIITED
          const payload_credit = {
            senderChannel: creditor_Details[0].channel,
            receiverChannel: user_Details[0].channel,
            sucessfulTransaction: sucessfulTransaction
          };

          //SIGN RESULTS
          jwt.sign(
            payload_credit,
            process.env.SECRET_TOKEN,
            async (error, signatureResults) => {
              if (error) {
                console.log(error);
              } else {
                //EMIT TRANSACTION

                myEmitter.emit("zatu_credit_transfer", signatureResults);

           
              }
            }
          );

          //SEND SMS TO RECEIVER
          smsFunction(message, sucessfulTransaction.receiver);
          return res.status(200).json({
            message: "Transaction successful",
            loan: loan_save_results
          });
        })
        .catch(error => {
          console.log(error);
          return res
            .status(500)
            .json({ message: "error processing transaction" });
        });

 
    }
  });
});

//ZATU CREDIT MAYMENT: PAYING BACK LOAN: LOAN SETTLEMENT
router.post("/credit/payment", verifyToken, (req, res) => {
  console.log("ACC TO ACC TRANSFER", req.body);
  if (
    typeof req.body.borrower == "undefined" ||
    typeof req.body.creditor == "undefined" ||
    typeof req.body.amount == "undefined" ||
    typeof req.body.loanId == "undefined"
  )
    return res.status(400).json({
      message: "borrower or creditor or amount or loanId missing"
    });

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      //verify amount
      if (Number(req.body.amount) < 0)
        return res.status(403).json({ message: "amount can't be negative" });

      const unique = uuidv4();
      //GET BORROWER DETAILS
      const borrower_Details = await User.find({
        phoneNumber: req.body.borrower
      });
      console.log(borrower_Details);

      //CHECK IF BORROWER EXIST
      if (borrower_Details.length == 0)
        return res
          .status(404)
          .json({ message: "borrower doesn't exists in the system" });

      //GET CREDITOR DETAILS
      const creditor_Details = await User.find({
        phoneNumber: req.body.creditor
      });

      //GET LOAN DETAILS
      const loan_Details = await Loans.find({ _id: req.body.loanId });
      console.log(loan_Details, "chikala");

      //CHECK IF LOAN EXISTS
      if (loan_Details.length == 0)
        return res
          .status(404)
          .json({ message: "loan doesn't exists in the system" });

      //CHECK IF LOAN HAS ALREADY BEEN PAID
      if (loan_Details[0].loanStatus == "Paid")
        return res
          .status(403)
          .json({ message: "loan has been settled already" });

      //CHECK IF CREDITOR EXIST
      if (creditor_Details.length == 0)
        return res
          .status(404)
          .json({ message: "creditor doesn't exists in the system" });

      //CHECK IF BORROWER HAS ENOUGH FUNDS
      if (borrower_Details[0].balance <= req.body.amount)
        return res
          .status(403)
          .json({ message: "borrower doesn't have enough funds" });

      //TRANSFER FUNDS FROM BORROWER TO CREDITOR
      const borrower_Remaining =
        borrower_Details[0].balance - Number(req.body.amount);
      const creditor_Remaining =
        creditor_Details[0].pool + Number(req.body.amount);

      console.log(borrower_Remaining, "XXXXXXC");
      const borrower_Transfer = await User.updateOne(
        { phoneNumber: req.body.borrower },
        { $set: { balance: borrower_Remaining } }
      );
      const credior_Transfer = await User.updateOne(
        { phoneNumber: req.body.creditor },
        { $set: { pool: creditor_Remaining } }
      );
      //CREATE TRANSACTION
      const sucessfulTransaction = new SucessfulTransaction({
        txnId: unique,
        amount: req.body.amount,
        sender: req.body.borrower,
        receiver: req.body.creditor,
        provider: 1,
        providertransactionId: unique,
        transactionType: "LOAN_SETTLEMENT",
        status: "SUCCESSFUL"
      });

      try {
        //SAVE SUCCESSFUL TRANSACTION TO DATABASE
        const successfultransaction = await sucessfulTransaction.save();

        //UPDATE LOAN DETAILS
        const transactionId = successfultransaction._id;
        const loanStatus = "PAID";
        const updatedLoan = await Loans.updateOne(
          { _id: req.body.loanId },
          {
            $set: {
              loanStatus: loanStatus,
              settlementtransactionReference: transactionId
            }
          }
        );

        //PAYLOAD TO BE EMIITED
        const payload = {
          receiverChannel: creditor_Details[0].channel,
          senderChannel: borrower_Details[0].channel,
          transaction: successfultransaction
        };

        const message = `You have received ZMW ${req.body.amount} from ${req
          .body
          .borrower} at ${successfultransaction.date}. TXT ID:${successfultransaction.txnId}`;

        //SEND SMS TO CREDITOR
        smsFunction(message, req.body.creditor);

        //EMIT TRANSACTION
        myEmitter.emit("zatu_transfer", payload);

        // console.log(deletedLoan);
        return res.status(200).json({
          message: "Transaction successful",
          transaction: successfultransaction
        });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "error processing transaction", error });
      }
    }
  });
});

//ZATU CREDIT TRANSFER FROM POOL TO BALANCE(current account) or FROM BALANCE TO POOL
router.post("/within", verifyToken, (req, res) => {
  console.log("ACC TO ACC TRANSFER");
  if (
    typeof req.body.from == "undefined" ||
    typeof req.body.to == "undefined" ||
    typeof req.body.amount == "undefined" ||
    typeof req.body.phoneNumber == "undefined"
  )
    return res.status(403).json({
      message: "specifications missing"
    });

  if (Number(req.body.amount) < 0)
    return res.status(403).json({ message: "amount can't be negative" });
  const unique = uuidv4();

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      //GET USER DETAILS
      const user_Details = await User.find({
        phoneNumber: req.body.phoneNumber
      });
      console.log(user_Details);

      //CHECK IF USER EXIST
      if (user_Details.length == 0)
        return res
          .status(403)
          .json({ message: "user doesn't exists in the system" });

      if (req.body.from == "Current Account" && req.body.to == "Pool Account") {
        if (user_Details[0].balance < req.body.amount)
          return res.status(403).json({ message: "operation not allowed" });

        //CREATE TRANSACTION
        const sucessfulTransaction = new SucessfulTransaction({
          txnId: unique,
          amount: req.body.amount,
          sender: req.body.phoneNumber,
          receiver: req.body.phoneNumber,
          provider: 1,
          providertransactionId: unique,
          transactionType: "BALANCE_TO_POOL",
          status: "SUCCESSFUL"
        });

        sucessfulTransaction
          .save()
          .then(async response => {
            //TRANSACTION BETWEEN POOL ACCOUNT AND MAIN ACCOUNT(update accounts)
            const user_final_account =
              user_Details[0].balance - Number(req.body.amount);
            const user_final_pool_account =
              user_Details[0].pool + Number(req.body.amount);
            const user_Transfer_result = await User.updateOne(
              { phoneNumber: user_Details[0].phoneNumber },
              {
                $set: {
                  balance: user_final_account,
                  pool: user_final_pool_account
                }
              }
            );

            //console.log(error);
            return res
              .status(200)
              .json({ message: "transfer successful", txnId: unique });
          })
          .catch(error => {
            console.log(error);
            return res
              .status(500)
              .json({ message: "error processing transaction" });
          });
      } else if (
        req.body.from == "Pool Account" &&
        req.body.to == "Current Account"
      ) {
        if (user_Details[0].pool < req.body.amount)
          return res.status(403).json({ message: "operation not allowed" });

        //CREATE TRANSACTION
        const sucessfulTransaction = new SucessfulTransaction({
          txnId: unique,
          amount: req.body.amount,
          sender: req.body.phoneNumber,
          receiver: req.body.phoneNumber,
          provider: 1,
          providertransactionId: unique,
          transactionType: "POOL_TO_BALANCE",
          status: "SUCCESSFUL"
        });

        sucessfulTransaction
          .save()
          .then(async response => {
            //TRANSACTION BETWEEN POOL ACCOUNT AND MAIN ACCOUNT(update accounts)
            const user_final_account =
              user_Details[0].balance + Number(req.body.amount);
            const user_final_pool_account =
              user_Details[0].pool - Number(req.body.amount);
            const user_Transfer_result = await User.updateOne(
              { phoneNumber: user_Details[0].phoneNumber },
              {
                $set: {
                  balance: user_final_account,
                  pool: user_final_pool_account
                }
              }
            );

            console.log(error);
            return res
              .status(200)
              .json({ message: "transfer successfull", txnId: unique });
          })
          .catch(error => {
            console.log(error);
            return res
              .status(500)
              .json({ message: "error processing transaction" });
          });
      }
    }
  });
});

//PAY FOR INDIVIDUAL GOODS IN CART
router.post("/bill/payment", verifyToken, async (req, res) => {
  const uniqueId = uuidv4();
  console.log("bill cart payment");

  console.log(req.body);

  if (
    typeof req.body.billId === "undefined" ||
    typeof req.body.amount === "undefined" ||
    typeof req.body.sender === "undefined" ||
    typeof req.body.receiver === "undefined"
  )
    return res.status(400).json({
      message: "Sender or receiver phone number or amount or bill is missing"
    });

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      try {
        const unique = uuidv4();
        const cart_results = await Cart.find({ _id: req.body.billId });

        if (cart_results.length == 0)
          return res.status(404).json({ message: "bill doesn't exist" });

        console.log(cart_results, "RESULTS");

        //GET SENDER DETAILS
        const senderDetails = await User.find({ phoneNumber: req.body.sender });
        console.log(senderDetails);

        //GET RECEIVER DETAILS
        const receiverDetails = await User.find({
          phoneNumber: req.body.receiver
        });
        console.log(receiverDetails);

        //CHECK IF SENDER (sending to own acccount)
        if (req.body.sender == req.body.receiver)
          return res.status(403).json({ message: "Operation not allowed" });

        //CHECK IF SENDER EXIST
        if (senderDetails.length == 0)
          return res.status(404).json({ message: "sender doesn't exists" });

        //CHECK IF RECEIVER EXIST
        if (receiverDetails.length == 0)
          return res.status(404).json({ message: "receiver doesn't exists" });

        const sender = senderDetails[0];
        const receiver = receiverDetails[0];

        //CHECK IF SENDER HAS ENOUGH FUNDS
        if (sender.balance <= req.body.amount)
          return res
            .status(403)
            .json({ message: "user doesn't have enough funds" });

        //TRANSACTION BETWEEN SENDER AND RECEIVER(update accounts)
        const senderRemaining = sender.balance - parseInt(req.body.amount);
        const receiverRemaining = receiver.balance + parseInt(req.body.amount);

        const senderTransfer = await User.updateOne(
          { phoneNumber: req.body.sender },
          { $set: { balance: senderRemaining } }
        );
        const receiverTransfer = await User.updateOne(
          { phoneNumber: req.body.receiver },
          { $set: { balance: receiverRemaining } }
        );

        //CREATE TRANSACTION
        const sucessfulTransaction = new SucessfulTransaction({
          txnId: unique,
          amount: req.body.amount,
          sender: req.body.sender,
          receiver: req.body.receiver,
          provider: 1,
          providertransactionId: unique,
          transactionType: "BILL_PAYMENT",
          status: "SUCCESSFUL"
        });

        //SAVE SUCCESSFUL TRANSACTION TO DATABASE
        const successfultransaction = await sucessfulTransaction.save();

        //PAYLOAD TO BE EMIITED
        const payload = {
          senderChannel: sender.channel,
          receiverChannel: receiver.channel,
          balance: unique
        };
        const updatedCart = await Cart.updateOne(
          { _id: req.body.billId },
          { $set: { status: "PAID" } }
        );
        const message = `You have received ZMW ${req.body.amount} from ${req
          .body
          .sender} at ${successfultransaction.date}. TXT ID:${successfultransaction.txn} for Bill Id ${req
          .body.billId}`;

        //SEND SMS TO RECEIVER
        smsFunction(message, req.body.receiver);

        //EMIT TRANSACTION
        myEmitter.emit("zatu_transfer", payload);

        res.status(200).json({
          message: "transaction sucesssfull. Biil has sucessfully been paid",
          txn: unique,
          balance: senderRemaining
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "errror processing bill"
        });
      }
    }
  });
});
// VERIFY TOKEN
function verifyToken(req, res, next) {
  //GET TOKEN
  const bearerHeader = req.headers["authorization"];

  //check if bearer undefined
  if (typeof bearerHeader !== "undefined") {
    //split bearer token
    const bearer = bearerHeader.split(" ");

    //get token from array
    const bearerToken = bearer[1];

    //set token
    req.token = bearerToken;
    //call next middleware
    next();
  } else {
    res.status(400).json({ message: "bearer token missing" });
  }
}

module.exports = router;
