//IMPORTS
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const Orders = require("../../model/OrderRequests");
const Product = require("../../model/Product");
const smsFunction = require("../zatu_verifications/sms");

require("dotenv").config;

//ZATU TRANSACTION
router.post("/", verifyToken, (req, res) => {
    let products = [];
  let client_orders = [];
  console.log("update status");

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      if (req.body.price == "") {
        res.status(400).json({ message: "price missing" });
        return;
      }
if(req.body.status == null || req.body.productId == null) return res.status(400).json({ message: "missing productId or status" });
 

      if (req.body.status == "NOT AVAILABLE") {

        
        //UPDATE PRODUCT STATUS NOT AVAILABLE
        const product_update = await Product.updateOne(
          { productId: req.body.productId },
          {
            $set: {
              status: req.body.status
            }
          }
        );
        res.status(200).json({
          message: "update received",
          update: product_update
        });
        return;
      }

      //UPDATE PRODUCT STATUS AVAILABLE
      const product_update = await Product.updateOne(
        { productId: req.body.productId },
        {
          $set: {
            status: req.body.status,
            price: req.body.price
          }
        }
      );

      res.status(200).json({
        message: "update received",
        update: product_update
      });


  //CHECK FOR PENDING ORDERS AND IF THEY ARE NONE, SEND PAYMENT LINK TO CLIENT
  
  
  //CHECK IF ORDER REQUEST EXIST
  const OrdersExist = await Orders.find({
    products: req.body.productId
  });

console.log(OrdersExist, "HERE");

  for (let i = 0; i < OrdersExist.length; i++){


    const orderred_products = await Product.find({
      
      productId: OrdersExist[i].products, status: "PENDING"
    });

   
    client_orders = orderred_products;

    //console.log(client_orders, "wwwwwwwwwwwwwwwwwwwwwwwwwwww")


  }

  if (  client_orders.length == 0){
  const message = encodeURIComponent( `Your order has successfully been processed, kindly pay for the goods via the link https://www.zatuwallet.com `)
  const sender = OrdersExist[0].sender
  //console.log(sender, "PAMATAKO")
  smsFunction(message, sender);
  }
    }
  });
});

// VERIFY TOKEN
function verifyToken(req, res, next) {
  console.log("MASTER")
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
