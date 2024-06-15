//IMPORTS
const router = require("express").Router();
const events = require("events");
const jwt = require("jsonwebtoken");

const myEmitter = new events.EventEmitter();

//STREAMS ROUTE
router.get("/", Emiiters, (req, res) => {
  console.log("streams connected");

  console.log(req.query.id);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.write("event: " + "connection\n");
  res.write("data: " + "connected\n\n");
});

//EMMITER MIDDLEWARE
function Emiiters(req, res, next) {
  //AUTHENTICATION ZATU ADMIN
  myEmitter.on("authenticated", function(mess) {
    console.log(`ZATU ADMIN AUTH ${mess}`);
    const decoded_event = JSON.parse(
      Buffer.from(mess.split(".")[1], "base64").toString()
    );
   
    console.log(decoded_event)
    if (req.query.id == decoded_event.channel) {
      res.write( "event: " + `authenticated\n`);
      res.write("data: " + `${mess}\n\n`);
    }

  
  });

  //INVOICE PROCESSING
  myEmitter.on("invoice_process_successful", function(mess) {
    console.log(`invoice_process_successful${mess}`);
    const decoded_event = JSON.parse(
      Buffer.from(mess.split(".")[1], "base64").toString()
    );

    console.log("zzzzzzzzzzzzz", decoded_event);
    if (req.query.id == decoded_event.eventChannel) {
      res.write("event: " + "invoice_process_successful\n");
      res.write("data: " + `${mess}\n\n`);
    }
  });
  myEmitter.on("momo_failed", function(mess) {
    console.log(`MOMO FAILED EMITTER ${mess}`);
    const decoded_event = JSON.parse(
      Buffer.from(mess.split(".")[1], "base64").toString()
    );

    console.log("zzzzzzzzzzzzz", kadi);
    if (req.query.id == kadi.phoneNumber) {
      res.write("event: " + "transaction\n");
      res.write("data: " + `${mess}\n\n`);
    }
  });

  myEmitter.on("momo_successful", function(mess) {
    console.log(`MOMO SUCCESS EMITTER ${mess}`);
    res.write("event: " + "momo_successful\n");
    if (req.query.id == mess.externalId) {
      res.write("data: " + `${mess}\n\n`);
    }
  });

  myEmitter.on("zatu", function(mess) {
    console.log(`ZATU EMITTER ${mess}`);

    if (req.query.id == mess.senderChannel) {
      res.write("data: " + `${mess.balance}\n\n`);
    }

    if (req.query.id == mess.receiverChannel) {
      res.write("data: " + `${mess.balance}\n\n`);
    }
  });

  myEmitter.on("zatu_transfer", function(mess) {
    console.log(`ZATU EMITTER ${mess}`);

    if (req.query.id == mess.senderChannel) {
      res.write("event: " + `transfer\n`);
      res.write("data: " + `${mess.balance}\n\n`);
    }

    if (req.query.id == mess.receiverChannel) {
      res.write("data: " + `${mess.balance}\n\n`);
    }
  });

  //ZATU CREDIT TRANSFER: borrowing money from pool account to current account
  myEmitter.on("zatu_credit_transfer", function(mess) {

    console.log(mess)
    const decoded_event = JSON.parse(
      Buffer.from(mess.split(".")[1], "base64").toString()
    );
    console.log(`ZATU EMITTER ${mess}`);

    if (req.query.id == decoded_event.senderChannel) {
      res.write("event: " + `zatu_credit_transfer\n`);
      res.write("data: " + `${mess}\n\n`);
    }

    if (req.query.id == decoded_event.receiverChannel) {
      res.write("event: " + `zatu_credit_transfer\n`);
      res.write("data: " + `${mess}\n\n`);
    }
  });
  myEmitter.on("zatu", function(mess) {
    console.log(`ZATU EMITTER ${mess}`);
    res.write("event: " + `zatu\n`);

    res.write("data: " + `${mess}\n\n`);
  });

  next();
}


module.exports = { router, myEmitter };
