const router = require("express").Router();
const Credit_Request = require("../../model/CreditRequest");
const User = require("../../model/User");
const smsFunction = require("../zatu_verifications/sms");
require("dotenv").config;
const bcryptjs = require("bcryptjs");


//CREDIT REGISTER
router.post("/register", async (req, res) => {
  let potential_user = "";

  console.log("BORROWER REGISTRATION", req.body.firstName);

  const firstName = String(req.body.firstName);
  const lastName = String(req.body.lastName);
  const creditLimit = String(req.body.creditLimit);
  const phoneNumber = String(req.body.phoneNumber);
  const creditScore = String(req.body.creditScore);
  //console.log("CREDIT REQUEST", req.body.firstName, "aaaaaaaaaaaaaaaaaa", firs);

  if (
    firstName == "undefined" ||
    lastName == "undefined" ||
    creditLimit == "undefined" ||
    phoneNumber == "undefined" ||
    creditScore == "undefined"
  )
    return res.status(400).json({ message: "fill out all details" });

    //CHECK IF CREDIT SCORE IS ABOVE 1
    if (creditScore > 1) return res.status(400).json({ message: "credit score cant above 1" });
  try {

    //OTP TO SEND TO CLIENT REGISTERED FOR THE FIRST TIME
    const otpCode = Math.floor(Math.random() * 1000000);
    // HASH PASSWORD
    const salt = await bcryptjs.genSalt(10);
    const harshedPassword = await bcryptjs.hash(`${otpCode}`, salt);

    //CHECK IF USER EXIST ALREADY
    const userExist = await User.find({ phoneNumber: phoneNumber });

    if (userExist.length == 0) {
      //CREATE USER
      const user = new User({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: "PENDING",
        password: harshedPassword,
        creditScore: creditScore,
        creditLimit: creditLimit,
        accountStatus: "CREDIT_RECEIVER_ONLY"
      });

      const savedUser = await user.save();
  
    const qualified_amount =
    savedUser.creditLimit * savedUser.creditScore;

  const message = encodeURIComponent(`Hello ${savedUser.firstName}, your number has been registered for credit and it qualifies to borrow ZMW ${qualified_amount}. Your OTP is ${otpCode}`);

  smsFunction(message, savedUser.phoneNumber);
  res
    .status(201)
    .json({ status: "successfull", message: savedUser});
    }else{
      return res
      .status(400)
      .json({ message: "user registered already"});

    }

    
  } catch (error) {
    console.log(error, "Failed to register credit request");
    res
      .status(500)
      .json({ status: "failed", error: "Error sending credit request" });
  }
});
module.exports = router;
