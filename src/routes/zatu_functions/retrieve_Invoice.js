const router = require("express").Router();
const Invoice = require("../../model/invoice");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

require("dotenv").config;

router.get("/", async (req, res) => {
  console.log("invoice hit");
  console.log(req.query.invoiceId);
    console.log(req.query.invoiceId);




  const invoice_query = String(req.query.invoiceId);
   const invoice_body = String(req.body.sender);

 if (invoice_query.toLowerCase() == "undefined" && invoice_body.toLowerCase() == "undefined")
 return res.status(400).json({ message: "Kindly provide either an InvoiceID or sender phone number" });


  if (invoice_query.toLowerCase() != "undefined") {
    //CHECK IF INVOICE EXIST
    const invoiceExist = await Invoice.find({
      invoiceId: invoice_query
    });



    console.log(invoiceExist)
    if (invoiceExist.length == 0)
      return res.status(400).json({ message: "iNVOICE DOES'NT EXIST" });

    res.status(200).json({ message: invoiceExist[0] });
  } else {
    //CHECK IF INVOICE EXIST
    const invoiceExist = await Invoice.find({
      sender: req.body.sender
    });

    if (invoiceExist.length == 0)
      return res.status(400).json({ message: "iNVOICE LIST EMPTY" });

    res.status(200).json({ message: invoiceExist[0] });
  }
});

module.exports = router;
