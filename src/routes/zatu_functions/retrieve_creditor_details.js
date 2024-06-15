const router = require("express").Router();
const User = require("../../model/User");

require("dotenv").config;

router.post("/", verifyToken, async (req, res) => {
  console.log("CREDITOR DETAILS");
  console.log(req.body.receiver);

  //FETCH CREDITOR
  const user = await User.find({
    phoneNumber: req.body.phoneNumber
  });

  if (user.length > 0) {
    const creditor = {
      fistName: user[0].firstName,
      lastName: user[0].lastName,
      interestRate: user[0].interestRate,
      creditAvailable: user[0].pool,
      phoneNumber: user[0].phoneNumber
    };

    return res.status(200).json({ message: creditor });
  } else {
    return res.status(404).json({ message: "Creditor doesn't exist" });
  }
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
