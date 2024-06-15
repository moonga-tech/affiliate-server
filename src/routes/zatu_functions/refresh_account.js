const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { v4: uuidv4 } = require("uuid");

const User = require("../../model/User");

//CHECK ACCOUNT

router.post("/", verifyToken, (req, res) => {
  console.log("ZATU  REFRESH");
  const unique = uuidv4();

  jwt.verify(req.token, process.env.SECRET_TOKEN, async (error, authData) => {
    if (error) {
      res.status(403).json({ message: "unauthorized client" });
    } else {
      //GET SENDER DETAILS
      const senderDetails = await User.find({
        phoneNumber: req.body.phoneNumber
      });
      console.log(senderDetails);

      //CHECK IF SENDER EXIST
      if (senderDetails.length == 0)
        return res.status(403).json({ message: "phone number doesn't exists" });

      const sender = senderDetails[0];

      res.status(200).json({ balance: sender.balance, pool: sender.pool });
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
