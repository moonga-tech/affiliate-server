const router = require("express").Router();
const Shop_Invoice = require("../../model/ShopInvoice");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../../model/User");
//EVENT EMITTER
const { myEmitter } = require("../streams/streams");

require("dotenv").config;

router.post("/", verifyToken, async (req, res) => {
  console.log(req.body);
  let products = [];
  let invoiceIds = [];
  let invoiceHolder = [];
  let database_invoice_holder = [];

  const unique = uuidv4();
  console.log("Shop Invoice hit");
 //console.log(req.body);

  if (typeof req.body.invoices == "undefined")
    return res.status(403).json({ message: "invoices missing" });

  // console.log(invoiceHolder)

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      invoiceHolder = req.body.invoices;
      for (let i = 0; i < req.body.invoices.length; i++) {
        const uniqueId = uuidv4();
        if (
          typeof req.body.invoices[i].salesAgent === "undefined" ||
          typeof req.body.invoices[i].invoiceId === "undefined" ||
          typeof req.body.invoices[i].invoiceItems === "undefined" ||
          typeof req.body.invoices[i].transactionType === "undefined" ||
          typeof req.body.invoices[i].syncStatus === "undefined"
        )
          return res.status(400).json({
            message: "missing fields in array"
          });

        invoiceIds.push(req.body.invoices[i].invoiceId);

        // console.log(invoiceIds);
      }
      const database_invoices = await Shop_Invoice.find({
        invoiceId: invoiceIds
      });

      //console.log(database_invoices, "ssssssssssssssss");
      if (database_invoices.length > 0) {
        for (let i = 0; i < database_invoices.length; i++) {
          database_invoice_holder.push(database_invoices[i].invoiceId);

          // console.log(invoiceIds);
        }
        for (let i = 0; i < req.body.invoices.length; i++) {
          const truth = database_invoice_holder.includes(
            req.body.invoices[i].invoiceId
          );
          console.log(truth, "Booleans from database");
          if (
            database_invoice_holder.includes(req.body.invoices[i].invoiceId) ==
            false
          ) {
            console.log(database_invoices);

            const inv = new Shop_Invoice({
              salesAgent: req.body.invoices[i].salesAgent,
              invoiceId: req.body.invoices[i].invoiceId,
              invoiceItems: req.body.invoices[i].invoiceItems,
              syncStatus: true,
              transactionType: req.body.invoices[i].transactionType
            });
            const eventObject = {
              eventChannel: req.body.eventChannel,
              invoice: inv
            };

            //SIGN RESULTS
            jwt.sign(
              eventObject,
              process.env.SECRET_TOKEN,
              async (error, signatureResults) => {
                if (error) {
                  console.log(error);
                } else {
                  myEmitter.emit("invoice_process_successful", signatureResults);

                 // console.log(eventObject)
                }
              }
            );
            products.push(inv);
          }
        }

        // return res.status(200).json({ message: "uploaded already", products });

        Shop_Invoice.bulkSave(products).then(onInsert);

        async function onInsert(response) {
          if (response.ok != 1) {
            return res
              .status(400)
              .json({ message: "products already uploaded" });
          } else {
            //const kadi = await process_image(req,res);
            return res
              .status(201)
              .json({ message: "upload successful", savedInvoices: response });
          }
        }
      } else {
        for (let i = 0; i < req.body.invoices.length; i++) {
          const inv = new Shop_Invoice({
            salesAgent: req.body.invoices[i].salesAgent,
            invoiceId: req.body.invoices[i].invoiceId,
            invoiceItems: req.body.invoices[i].invoiceItems,
            syncStatus: true,
            transactionType: req.body.invoices[i].transactionType
          });

          const eventObject = {
            eventChannel: req.body.eventChannel,
            invoice: inv
          };

          //SIGN RESULTS
          jwt.sign(
            eventObject,
            process.env.SECRET_TOKEN,
            async (error, signatureResults) => {
              if (error) {
                console.log(error);
              } else {
                myEmitter.emit("invoice_process_successful", signatureResults);

               // console.log(eventObject)
              }
            }
          );
          products.push(inv);
        }

        Shop_Invoice.bulkSave(products).then(onInsert);

        async function onInsert(response) {
          if (response.ok != 1) {
            return res.status(400).json({ message: "error occurred" });
          } else {
            //const kadi = await process_image(req,res);
            return res
              .status(201)
              .json({ message: "upload successful", savedInvoices: response });
          }
        }
      }

      // return res.status(200).json({
      //   message: filtered
      // });
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
