const router = require("express").Router();
const Orders = require("../../model/OrderRequests");

const Product = require("../../model/Product");

require("dotenv").config;

router.post("/", verifyToken, async (req, res) => {
  let products = [];
  let client_orders = [];

  console.log("order hitttt");
  console.log(req.body.receiver);

  //CHECK IF ORDER REQUEST EXIST
  const OrdersExist = await Orders.find({
    receiver: req.body.receiver
  });

console.log(OrdersExist);

  for (let i = 0; i < OrdersExist.length; i++){


    const orderred_products = await Product.find({
      
      productId: OrdersExist[i].products, status: "PENDING"
    });

    //CREATE ORDER
    const order_ = new Orders({
      receiver: OrdersExist[i].receiver,
      sender: OrdersExist[i].sender,
      products: orderred_products
    });

   
  client_orders.push(order_);
  //console.log(client_orders)

  }

  if (OrdersExist.length == 0)
    return res.status(400).json({ message: "ORDER REQUEST EMPTY" });

  res.status(200).json({ message: client_orders });
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
