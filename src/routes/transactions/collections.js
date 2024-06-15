const jwt = require("jsonwebtoken");
const router = require("express").Router();

const axios = require("axios");
const { setRandomFallback } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const User = require("../../model/User");
const SucessfulTransaction = require("../../model/SucessfulTransaction");
const initiate_Momo_Collection = require("../collection_functions/mtn_collection_function");

//EVENT EMITTER
const { myEmitter } = require("../zatu_verifications/callback");

require("dotenv").config;

router.post("/", verifyToken, (req, res) => {
  console.log(req.body);
  if (
    typeof req.body.provider === "undefined" ||
    typeof req.body.amount === "undefined" ||
    typeof req.body.sender === "undefined" ||
    typeof req.body.receiver === "undefined"
  )
    return res.status(400).json({
      message:
        "Sender or receiver phone number or amount or provider is missing "
    });

  const uniqueId = uuidv4();

  //PROVIDER FIELD MISSING
  if (req.body.provider == null)
    return res.status(400).json({ message: "provider field missing" });

  //VERIFY TOKEN
  jwt.verify(req.token, process.env.SECRET_TOKEN, (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      if (req.body.provider == 1) {
        //INITIATE AIRTEL TRANSFER( collect funds from AIRTEL account)
        console.log("AIRTEL");
        return res.status(400).json({
          message: "Airtel network not currently working"
        });
      } else if (req.body.provider == 2) {
        //INITIATE MOMO TRANSFER( collect funds from momo account)
        console.log("MTN");

        initiate_Momo_Collection(uniqueId, req, res);
      } else if (req.body.provider == 3) {
        //INITIATE ZAMTEL TRANSFER( collect funds from ZAMTEL account)
        console.log("ZAMTEL");
        return res.status(400).json({
          message: "Airtel network not currently working"
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
