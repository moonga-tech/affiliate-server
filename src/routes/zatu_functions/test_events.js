const router = require("express").Router();
const Credit_Request = require("../../model/CreditRequest");
const User = require("../../model/User");
const smsFunction = require("../zatu_verifications/sms");
const jwt = require("jsonwebtoken");
require("dotenv").config;
const bcryptjs = require("bcryptjs");
//EVENT EMITTER
const { myEmitter } = require("../streams/streams");

//CREDIT REGISTER
router.post("/", async (req, res) => {
    const kadi = req.body
      //SIGN TOKEN
  jwt.sign(kadi, process.env.SECRET_TOKEN, async (error, token) => {
    if (error) {
      console.log(error);
    } else {
  

        console.log(req.body)

    
        myEmitter.emit("momo_failed", token);
        res.status(200).json({message: "EVENT ACCEPTED"})
    }
  });
});
module.exports = router;
