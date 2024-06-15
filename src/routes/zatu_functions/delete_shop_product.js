const router = require("express").Router();
const ShopProduct = require("../../model/ShopProducts");

const jwt = require("jsonwebtoken");
require("dotenv").config;

router.post("/", verifyToken, async (req, res) => {
    console.log("DELETE ", req.body)
  if (typeof req.body._id === "undefined" || req.body._id == "") {
    return res.status(403).json({ message: "_id missinng" });
  }
  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      try {
       const response =  await ShopProduct.findByIdAndDelete(req.body._id);
       if(response == null){
        return res.status(200).json({ message: "product not found"});
       }else{
        return res.status(200).json({ message: "successfully deleted", response });
       }
  
      } catch (error) {
        console.log(error, "Failed to delete");
        res.status(500).send("Failed to delete");
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
