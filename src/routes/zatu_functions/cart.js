const router = require("express").Router();
const Cart = require("../../model/Cart");
const Product_info = require("../../model/ShopProducts");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const initiate_Momo_Collection = require("../collection_functions/mtn_collection_function");
require("dotenv").config;


//ADD TO CART
router.post("/add", verifyToken, async (req, res) => {
  console.log("cart hit");
  console.log(req.body);

  if (
    typeof req.body.productId == "undefined" ||
    typeof req.body.sizesWanted == "undefined" ||
    typeof req.body.buyer == "undefined" ||
    typeof req.body.seller == "undefined"
  )
    return res.status(403).json({ message: "fill out all the details" });

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      const product_infor = await Product_info.find({
        _id: req.body.productId
      });
      if (product_infor.length == 0)
        return res.status(403).json({ message: "product doesn't exist" });

      const quantity = String(req.body.sizesWanted).split(",");

      const subtotal = product_infor[0].price * quantity.length;
      //CREATE Cart OBJECT
      const cartObject = new Cart({
        productUrl: product_infor[0].productImage,
        buyer: req.body.buyer,
        seller: req.body.seller,
        quantity: quantity.length,
        productId: req.body.productId,
        productSpecifications: req.body.sizesWanted,
        subtotal: subtotal,
        price: product_infor[0].price
      });

      try {
        const savedCart = await cartObject.save();
        if (typeof req.body.buyer == "undefined")
          return res.status(400).json({ message: "phone number missing" });
        const cart = await Cart.find({
          buyer: req.body.buyer
        });

        res.status(201).json({
          message: cart
        });
      } catch (error) {
        console.log(error, "Failed to add to cart");
        res.status(500).send("Failed to add to cart");
      }
    }
  });
});

//RETRIEVE CART
router.post("/retrieve", verifyToken, async (req, res) => {
  console.log("cart hit");

  console.log(req.body);

  if (typeof req.body.phoneNumber == "undefined")
    return res.status(400).json({ message: "phone number missing" });

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      const cart = await Cart.find({
        buyer: req.body.phoneNumber
      });

      res.status(200).json({ message: cart });
    }
  });
});


//DELETE PRODUCT FROM CART
router.post("/delete", verifyToken, async (req, res) => {
  console.log("cart delete");

  console.log(req.body);

  if (typeof req.body._id == "undefined")
    return res.status(400).json({ message: "Id missing" });

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      const cart = await Cart.deleteOne({
        _id: req.body._id
      });

      res.status(200).json({ message: cart });
    }
  });
});

//PAY FOR GOODS IN CART
router.post("/payment", verifyToken, process_transaction, async (req, res) => {
  const uniqueId = uuidv4();
  console.log("cart payment");

  console.log(req.body);

  if (
    typeof req.body.provider === "undefined" ||
    typeof req.body.amount === "undefined" ||
    typeof req.body.sender === "undefined" ||
    typeof req.body.receiver === "undefined"
  )
    return res.status(400).json({
      message:
        "Sender or receiver phone number or amount or provider is missing"
    });

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      if (req.body.provider == 1) {
        //INITIATE AIRTEL TRANSFER( collect funds from AIRTEL account)
        console.log("AIRTEL");
        return res.status(400).json({
          message: "Airtel network currently not working"
        });
      } else if (req.body.provider == 2) {
        //INITIATE MOMO TRANSFER( collect funds from momo account)
        console.log("MTN");

        initiate_Momo_Collection(uniqueId, req, res);
      } else if (req.body.provider == 3) {
        //INITIATE ZAMTEL TRANSFER( collect funds from ZAMTEL account)
        console.log("ZAMTEL");
        return res.status(400).json({
          message: "Airtel network currently not working"
        });
      }
    }
  });
});



// PROCESS TRANSACTION
async function process_transaction(req, res, next) {
  let total_in_cart = 0;
  const cart_results = await Cart.find({
    buyer: req.body.cartId
  });

  for (let i = 0; i < cart_results.length; i++) {
    total_in_cart += cart_results[i].subtotal;
  }

  req.body.amount = total_in_cart;
  req.body.sender = req.body.cartId;
  req.body.receiver = req.body.shopId;

  console.log("TOTAL IN CART", total_in_cart);

  next();
}

// VERIFY TOKEN
function verifyToken(req, res, next) {
  //console.log(req);

  //GET TOKEN
  const bearerHeader = req.headers["authorization"];

  //console.log(cookies)

  //check if bearer undefined
  if (typeof bearerHeader != "undefined" || typeof req.cookies != "undefined") {
    if (typeof bearerHeader != "undefined") {
      //split bearer token
      const bearer = bearerHeader.split(" ");

      //get token from array
      const bearerToken = bearer[1];

      //set token
      req.token = bearerToken;
      //call next middleware
      next();
    } else {
      // const cookies = req.cookies.token
      //set token
      req.token = req.cookies.token;
      //call next middleware
      next();
    }
  } else {
    res.status(400).json({ message: "bearer token missing" });
  }
}

module.exports = router;
