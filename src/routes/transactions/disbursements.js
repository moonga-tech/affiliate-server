const jwt = require("jsonwebtoken");
const router = require("express").Router();
const initiate_Momo_Disbursement = require("../dibursement_functions/mtn_disbursement")

const { v4: uuidv4 } = require("uuid");


require("dotenv").config;


router.post("/", verifyToken, (req, res) => {


  console.log(req.body);

  if (
    typeof req.body.sender == "undefined" ||
    typeof req.body.receiver == "undefined" ||
    typeof req.body.amount == "undefined" ||
    typeof req.body.provider == "undefined"
  )
    return res.status(403).json({
      message: "specifications missing"
    });
  const unique = uuidv4();
  let token = '';


  //PROVIDER FIELD MISSING
  if (req.body.provider == null) return res.status(400).json({ message: "provider field missing" });


  //AIRTEL MONEY TRANSFER
  if (req.body.provider == 1) {

    console.log("AIRTEL TRANSFER")
    res.status(500).json({ message: "Server down" });
  }

  //MOMO MONEY TRANSFER

  else if (req.body.provider == 2) {
    jwt.verify(req.token, process.env.SECRET_TOKEN, (error, authData) => {
      if (error) {
        res.status(403).json({ message: "unauthorized client" });
      } else {
        initiate_Momo_Disbursement(unique, req, res);
      }
    });

  }


  //ZAMTEL MONEY ROUTE
  else if (req.body.provider == 3) {

    console.log("ZAMTEL TRANSFER")
    res.status(500).json({ message: "Server down" });

  }


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
