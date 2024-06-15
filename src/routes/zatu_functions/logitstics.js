const jwt = require("jsonwebtoken");
const router = require("express").Router();
const Parcel = require("../../model/Parcel");
const mongoose = require("mongoose");
const axios = require("axios");
const { setRandomFallback } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");



//EVENT EMITTER
const { myEmitter } = require("./callback");

require("dotenv").config;

//MOMO PAYMENT

router.post("/momo", verifyToken, (req, res) => {
  console.log(req.body);
  const unique = uuidv4();

  jwt.verify(req.token, process.env.SECRET_TOKEN, (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      const parcel = new Parcel({
        receiverphoneNumber: req.body.receiver,
    senderphoneNumber: req.body.sender,
        destination: req.body.destination,

      });

      //GENERATE TOKEN MOMO
      var session_url = "https://proxy.momoapi.mtn.com/collection/token/";

      var uname = process.env.MOMO_USER_NAME;
      var pass = process.env.MOMO_PASSWORD;
      const sub_key = process.env.SUB_KEY;

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
          console.log(Response.data);
          const access_token = Response.data.access_token;

          //PAYMENT REQUEST MOMO

          const paymentRequest = {
            amount: req.body.amount,
            currency: "ZMW",
            externalId: unique,
            payer: {
              partyIdType: "MSISDN",
              partyId: req.body.sender
            },
            payerMessage: req.body.receiver,
            payeeNote: req.body.payeeNote
          };

          var session_url =
            "https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay";

          axios.post(session_url, paymentRequest, {
            headers: {
              "Content-Type": "application/json",
              "X-Reference-Id": unique,
              "X-Target-Environment": "mtnzambia",

              "Ocp-Apim-Subscription-Key": sub_key,
              Authorization: "Bearer " + access_token
            }
          });
        })
        .then(Response => {
          console.log("MoMo successfully initiated");
          res
            .status(202)
            .json({ message: "MoMo successfully initiated", id: unique });
        })
        .then(payment.save())
        .catch(error => {
          res.status(400).json({ message: "Fatal error occured" });
          console.log(error);
        });
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
  