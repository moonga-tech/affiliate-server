//IMPORTS
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const User = require("../../model/User");
const smsFunction = require("../zatu_verifications/sms");

require("dotenv").config;

//PROFILE
router.post("/profilepicture", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      if (req.body.image == "")
        return res.status(400).json({ message: "image missing" });

      //UPDATE PROFILE IMAGE
      const User_update = await User.updateOne(
        { phoneNumber: req.body.phoneNumber },
        {
          $set: {
            profilePicture: req.body.image
          }
        }
      );

      res.status(200).json({
        message: "updated",
        update: User_update
      });
    }
  });
});

router.post("/interestrate", verifyToken, (req, res) => {
  if (
    typeof req.body.phoneNumber == "undefined" ||
    typeof req.body.interestRate == "undefined"
  )
    return res
      .status(403)
      .json({ message: "phone number missing or interest rate" });
  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      //UPDATE PROFILE IMAGE
      const User_update = await User.updateOne(
        { phoneNumber: req.body.phoneNumber },
        {
          $set: {
            interestRate: req.body.interestRate
          }
        }
      );

      res.status(200).json({
        message: "updated",
        update: User_update
      });
    }
  });
});

// VERIFY TOKEN
function verifyToken(req, res, next) {
  console.log("MASTER");
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
