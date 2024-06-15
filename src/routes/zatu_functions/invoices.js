const router = require("express").Router();
const Invoice = require("../../model/invoice");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const axios  = require("axios");

require("dotenv").config; 

router.post("/", verifyToken, async (req, res) => {
  const zamtelKey = process.env.ZAMTEL_KEY
  const unique = uuidv4();
  console.log("invoice hit");
  console.log(req.body);

if(req.body.to == null || req.body.from == null) return res.status(403).json({ message: "fill out all the details" });


  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      //CREATE INVOICE OBJECT
      const invoice = new Invoice({
        invoiceId: unique,
        from: req.body.from,
        to: req.body.to,

        invoiceItems: req.body.products
      });
      

      if (req.body.products == null)
        return res.status(400).json({ message: "products can't be null" });

      try {
        const message =   encodeURIComponent(`You have a pending bill to pay via the link ` + ` https://zatuwallet.onrender.com/invoicelist.html?invoiceId=${unique}`);
        const savedinvoice = await invoice.save();

        //GENERATE TOKEN MOMO
        var session_url = `https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key/${zamtelKey}/contacts/26${req.body.to}/senderId/ZatuWallet/message/${message}`;

        const smsResponse = await axios.get(session_url);
        console.log(smsResponse.data);

        res.status(201).json({
          messsage: "invoice sucessfully registered",
          invoice: savedinvoice
        });
      } catch (error) {
        console.log(error, "Failed to register invoice");
        res.status(500).send("Failed to register invoice");
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
