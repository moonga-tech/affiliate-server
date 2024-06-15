const express = require("express");
const path = require("path");
const Model = require("./model/FashionModel");
const puppeteer = require("puppeteer");
const app = express();
const cookieParser = require("cookie-parser");
const resolveTransaction = require("./routes/schedules/resolve_pending_transaction");
const send_sms_to_debtors = require("./routes/schedules/credit_collection");
const process_folder = require("./routes/zatu_functions/read_folder");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { myEmitter } = require("./routes/streams/streams");
const cors = require("cors");
const smsShareholdres = require("./routes/zatu_functions/shareholders");
dotenv.config();
//const bob =require("./routes/zatu_verifications/patrick");
const schedule = require("node-schedule");
const smsFunction = require("./routes/zatu_verifications/sms");
async function sms_model() {
  let contact_list = [];
  const model_results = await Model.find({});
  //console.log(model_results);

  try {
    for (let i = 0; i < model_results.length; i++) {
      // const updated_model = await Model.updateOne(
      //   { phoneNumber: model_results[i].phoneNumber },
      //   { $unset: { profilePicture: "" } }
      // );
    const firstName=   model_results[i].fullNames.split(' ')

    console.log(firstName[0])
      contact_list.push(model_results[i].phoneNumber);

      const message = `Hello ${firstName[0]}, kindly sign up via our system https://lydiahouse.onrender.com/wallet.html and come for orientation on how to use it between Monday and Wednesday. Call 0976240701 for any queries`;
//console.log(message)
      //SEND SMS TO CREDITOR
    //  smsFunction(message, model_results[i].phoneNumber, "LydiaHouse");
    }
  } catch (error) {
    console.log(error);
  }
  console.log(contact_list);
}

//bob()
//SCHEDULED FUNCTIONS
schedule.scheduleJob("*/20 * * * * *", () => resolveTransaction());
//schedule.scheduleJob("*/5 * * * * *", () => send_sms_to_debtors());
//process_folder();
// executablePath: '/usr/bin/chromium-browser',args:['--disable-gpu','--disable--setupid-sandbox','--no-sandbox','--no-zygote'],
async function generate_pdf() {
  try {
    const browser = await puppeteer.launch({
      // executablePath: '/usr/bin/google-chrome',args:['--disable-gpu','--disable--setupid-sandbox','--no-sandbox','--no-zygote'],
      headless: false,
      defaultViewport: false,
      userDataDir: "./temp"
    });

    const page = await browser.newPage();
    await page.goto("https://www.facebook.com", { waitUntil: "networkidle0" });
    const but = await page.waitForSelector(
      " div.x1cy8zhl.x78zum5.x1iyjqo2.xs83m0k.xh8yej3 > div"
    );
    but.click();
    const kadi = await page.$(
      " div.xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.x9f619.x1lliihq.x5yr21d.xh8yej3.notranslate > p"
    );
    // const kadi = await page.evaluate(()=>{
    // const kadi=  document.querySelector("xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 xdpxx8g");
    // return kadi;
    // console.log(kadi)
    //  // document.body.xdj266r.x11i5rnm xat24cr x1mh8g0r x16tdsg8 xdpxx8g innerHTML += "<span>aaa</span>"
    // })

    console.log(kadi);
    //const clic = await page.$(" div.xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.x9f619.x1lliihq.x5yr21d.xh8yej3.notranslate > p")

    //     const email_input = await page.waitForSelector("#email");

    //     console.log(email_input)
    //     if (kadi == "kadi") {

    //       await page.type("#email", "deegostores@gmail.com");
    //       await page.type("#pass", "Kadi@1992kadi");

    //       await page.click("button");
    //     } else {
    //       console.log("chikala");
    //      const but = await page.waitForSelector(
    //         " div.x1cy8zhl.x78zum5.x1iyjqo2.xs83m0k.xh8yej3 > div"
    //       );
    // but.click()
    //      // await page.click("div.x1cy8zhl.x78zum5.x1iyjqo2.xs83m0k.xh8yej3 > div > div.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x1ey2m1c.xds687c.xg01cxk.x47corl.x10l6tqk.x17qophe.x13vifvy.x1ebt8du.x19991ni.x1dhq9h.x1wpzbip")
    //       console.log("chikala");
    //     }
  } catch (error) {}
}
//generate_pdf();

{
  /* <div _ngcontent-edp-c66="" class="buttons"><button _ngcontent-edp-c66="" type="button" class="minus ng-star-inserted"></button><!----></div> */
}

// setInterval(() => {
//   const kadi = {
//     amount: "1000",
//     firstName: "Kadi",
//     lastName: "kabengele"
//   };
//   //SIGN RESULTS
//   jwt.sign(kadi, process.env.SECRET_TOKEN, async (error, signatureResults) => {
//     if (error) {
//       console.log(error);
//     } else {
//       myEmitter.emit("authenticated", signatureResults);
//     }
//   });
// }, 7000);
//smsShareholdres();
//////START---IMPORTED ROUTES/////////

//ZATU FUNCTIONS ROUTE
const invoicelistRoute = require("./routes/zatu_functions/retrieve_Invoice");
const invoiceRoute = require("./routes/zatu_functions/invoices");
const uuidRoute = require("./routes/zatu_functions/uuid");
const transactionstatusRoute = require("./routes/zatu_functions/transaction_status");
const transactionlistRoute = require("./routes/zatu_functions/transaction_list");
const refreshRoute = require("./routes/zatu_functions/refresh_account");
const orderrequestRoute = require("./routes/zatu_functions/order_request");
const retrieveordertRoute = require("./routes/zatu_functions/retrieve_orders");
const updateordertRoute = require("./routes/zatu_functions/update_order");
const credit_request_Route = require("./routes/zatu_functions/credit_register");
const resetRoute = require("./routes/zatu_verifications/resetcodes");
const streamsRoute = require("./routes/streams/streams");
const process_image_Route = require("./routes/zatu_functions/process_image");
const shop_storage_Route = require("./routes/zatu_functions/shopproducts");
const delete_shop_Route = require("./routes/zatu_functions/delete_shop_product");
const add_to_cart_Route = require("./routes/zatu_functions/cart");
const update_profile_image_Route = require("./routes/zatu_functions/update_profile");
const test_Route = require("./routes/zatu_functions/test_events");
const creditor_details_Route = require("./routes/zatu_functions/retrieve_creditor_details");
const physical_shop_invoices_Route = require("./routes/zatu_functions/shop_invoices");
const online_shops_Route = require("./routes/zatu_functions/online_shops");
const shareholders_Route = require("./routes/zatu_functions/shareholder_list");

//COLLECTION ROUTES
const checkoutRoute = require("./routes/transactions/checkout");
const invoicepaymentRoute = require("./routes/transactions/invoice_payment");

//TRANSFER ROUTES
const admin_Route = require("./routes/transactions/admins");
const zatu_transferRoute = require("./routes/transactions/zatu_transfer");
const transferRoute = require("./routes/transactions/disbursements");

//COLLECTION ROUTES
const collectionRoute = require("./routes/transactions/collections");

//ZATU VERIFICATIONS
const usermomoregisterationRoute = require("./routes/zatu_verifications/user_momo_registeration");
const userinforRoute = require("./routes/zatu_verifications/user_basic_infor");
const loginRoute = require("./routes/zatu_verifications/login");
const callbackRoute = require("./routes/zatu_verifications/callback");
const registerRoute = require("./routes/zatu_verifications/register");
const zatuusernamesRoute = require("./routes/zatu_verifications/zatu_user_name");
const smsRoute = require("./routes/zatu_verifications/sms");
const { promises } = require("dns");

//////END---IMPORTED ROUTES/////////

//PORT LISTENING
const PORT = process.env.PORT || 600;

function portListening() {
  return app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

//MONGOOSE MIDDLEWARE
mongoose.set("strictQuery", true);

//DATABSE URL
const url = process.env.DB_CONNECT;

//CONNECT TO DATABASE
mongoose.connect(url, err => {
  if (!err) {
    console.log("Connected to DB");

    portListening();
   // sms_model();
  } else {
    console.log(err);
  }
});

//ROUTE MIDDLEWARE
app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "Public")));
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb" }));
app.use("/api/v1/invoices", invoiceRoute);
app.use("/api/v1/login", loginRoute);
app.use("/invoicelist", invoicelistRoute);
app.use("/api/v1/sms", smsRoute);
app.use("/api/v1/uuid", uuidRoute);
app.use("/api/v1/register", registerRoute);
app.use("/api/v1/register/link", registerRoute);
app.use("/api/v1/callback", callbackRoute);
app.use("/api/v1/userinfor", userinforRoute);
app.use("/api/v1/transactionstatus", transactionstatusRoute);
app.use("/api/v1/transactionlist", transactionlistRoute);
app.use("/api/v1/momo/user/register", usermomoregisterationRoute);
app.use("/api/v1/zatu/usernames", zatuusernamesRoute);
app.use("/api/v1/accountbalance", refreshRoute);
app.use("/api/v1/orders", orderrequestRoute);
app.use("/api/v1/retrieve/orders", retrieveordertRoute);
app.use("/api/v1/update/orders", updateordertRoute);
app.use("/api/v1/credit", credit_request_Route);
app.use("/api/v1/resetcode", resetRoute);
app.use("/api/v1/processimages", process_image_Route);
app.use("/api/v1/shopstorage", shop_storage_Route);
app.use("/api/v1/shopstorage/delete", delete_shop_Route);
app.use("/api/v1/cart", add_to_cart_Route);
app.use("/api/v1/profile/update", update_profile_image_Route);
app.use("/stream", streamsRoute.router);
app.use("/test", test_Route);
app.use("/api/v1/creditor/details", creditor_details_Route);
app.use("/api/v1/physicalshops", physical_shop_invoices_Route);
app.use("/api/v1/onlinestores", online_shops_Route);
app.use("/api/v1/shareholders", shareholders_Route);

app.use("/api/v1/admin", admin_Route);
//COLLECTION MIDDLEWARE (ASSETS)
app.use("/api/v1/collections", collectionRoute);
app.use("/api/v1/invoicepayment", invoicepaymentRoute);
app.use("/api/v1/checkout", checkoutRoute);


//TRANSFERS MIDDLEWARE (LIABILITIES)
app.use("/api/v1/transfer", transferRoute);
app.use("/api/v1/transfer/zatu", zatu_transferRoute);

//////START--PUBLIC PAGES

//INDEX
app.get("/", (req, res) => {
  console.log("Index Page");
  res.sendFile(path.join(__dirname, "./Public/index.html"));
});

//PRODUCT IMAGES
app.get("/products", (req, res) => {
  console.log("PRODUCT IMAGES");
  res.sendFile(path.join(__dirname, "./Public/products"));
});
//WALLET PAGE
app.get("/wallet", (req, res) => {
  console.log("Walllet Page");
  res.sendFile(path.join(__dirname, "./Public/wallet.html"));
});

//INVOICE PAGE
app.get("/invoicelist", (req, res) => {
  console.log("invoice");
  res.sendFile(path.join(__dirname, "./Public/invoicelist.html"));
});

//DOWNLOAD LINK
app.get("/download/:filename", (req, res) => {
  console.log(req);
  const filePath = __dirname + "/Public/apps/" + req.params.filename;
  res.download(
    filePath,
    "shopmanager.apk", // Remember to include file extension
    err => {
      if (err) {
        res.send({
          error: err,
          msg: "Problem downloading the file"
        });
      }
    }
  );
});

//DOWNLOAD LINK PDF FILE
app.get("/downloadpdf/:filename", (req, res) => {
  //generate_pdf();
  const randomNumber = Math.floor(Math.random() * 1000000);
  console.log(req);
  const filePath = __dirname + "/Public/barcodes/" + req.params.filename;
  res.download(
    filePath,
    `shopmanager-${randomNumber}.pdf`, // Remember to include file extension
    err => {
      if (err) {
        res.send({
          error: err,
          msg: "Problem downloading the file"
        });
      }
    }
  );
});

app.get("/video", function(req, res) {
  const fs = require("fs");
  console.log("ccccccccccccccc");
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  // get video stats (about 61MB)
  const videoPath = "Public/videos/Screen_Recording_shop_manager.mp4";
  const videoSize = fs.statSync(
    "Public/videos/Screen_Recording_shop_manager.mp4"
  ).size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4"
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});

//PAGE NOT FOUND ROUTE
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./Public/404.html"));
});

//////END--PUBLIC PAGES
