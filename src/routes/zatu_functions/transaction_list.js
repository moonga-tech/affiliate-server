const jwt = require("jsonwebtoken");
const router = require("express").Router();

const Transaction = require("../../model/SucessfulTransaction");
require("dotenv").config;

//ZATU TRANSACTION LIST

router.post("/", verifyToken, (req, res) => {
  console.log("Transaction List");

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      //GET SENDER TRANSACTION LIST
      const senderlist = await Transaction.find({
        sender: req.body.phoneNumber
      });

      //GET SENDER TRANSACTION LIST
      const receiverlist = await Transaction.find({
        receiver: req.body.phoneNumber
      });

      const transactionlist = [...senderlist, ...receiverlist];
      res.status(200).json({ message: transactionlist });
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
