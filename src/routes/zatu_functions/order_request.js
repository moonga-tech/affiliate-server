const router = require("express").Router();
const Order = require("../../model/OrderRequests");

const Product = require("../../model/Product");

require("dotenv").config;

router.post("/", async (req, res) => {
  console.log("ORDER REQUEST");



  let products_reference = [];
  //CREATE ORDER TO LOOP THROUGH
  const order_loop = new Order({
    receiver: req.body.receiver,
    sender: req.body.sender,
    products: req.body.products
  });


  if(order_loop.products.length == 0)
  return res.status(400).json({ message: "Product list empty" });

  order_loop.products.forEach(async product => {

    
    //CREATE product
    const product_ = new Product({
      productId: product.productId,
      productImage: product.productImage,
      status: product.status,
      quantity: product.quantity,
      sizesWanted: product.sizesWanted,
      creator: product.creator
    });
    products_reference.push(product_.productId)
    await product_.save();
  });



  try {

    const order = new Order({
      receiver: req.body.receiver,
      sender: req.body.sender,
      products: products_reference
    });
  
    const savedOrder = await order.save();
    res.status(201).json({ status: "successfull", savedOrder: savedOrder });
  } catch (error) {
    console.log(error, "Failed to register user");
    res.status(500).json({ status: "failed", error: "Error sending orderrequest" });
  }
});

module.exports = router;
