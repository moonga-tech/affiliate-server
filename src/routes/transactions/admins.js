const router = require("express").Router();
const Successful_transaction_List = require("../../model/SucessfulTransaction");
const Failed_transaction_List = require("../../model/FailedTransaction");
const Pending_transaction_List = require("../../model/PendingPayment");

const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../../model/User");
const { myEmitter } = require("../streams/streams");
require("dotenv").config;

router.post("/transactions", async (req, res) => {
  console.log(req.body);
  console.log("admin hitttt");

  if (req.body.transactionType == "SUCCESSFUL") {
    if (typeof req.body.transactionId != "undefined") {
      const successful_transaction_List = await Successful_transaction_List.find(
        { txnId: req.body.transactionId }
      );

      return res.status(200).json({ message: successful_transaction_List });
    }

    //CHECK SUCCESSFUL
    const successful_transaction_List = await Successful_transaction_List.find(
      {}
    );

    res.status(200).json({ message: successful_transaction_List });
  } else if (req.body.transactionType == "PENDING") {
    if (typeof req.body.transactionType == "undefined") {
      const pending_transaction_List = await Pending_transaction_List.find({});

      return res.status(200).json({ message: pending_transaction_List });
    }
    //CHECK PENDING TRANSACTION
    const pending_transaction_List = await Pending_transaction_List.find({});

    res.status(200).json({ message: pending_transaction_List });
  } else if (req.body.transactionType == "FAILED") {
    //CHECK FAILED TRANSACTION
    const failed_transaction_List = await Failed_transaction_List.find({});

    res.status(200).json({ message: failed_transaction_List });
  }
});

//FETCH USER ACCOUNTS
router.post("/users", async (req, res) => {
  console.log(req.body);

  if (typeof req.body.userId == "undefined") {
    return res.status(400).json({ message: "user Id missing" });
  }
  if (req.body.userId == "all") {
    const userExist = await User.find();
    return res.status(200).json({ message: userExist });
  }

  //CHECK IF USER EXIST
  const userExist = await User.find({ phoneNumber: req.body.userId });

  if (userExist.length === 0)
    return res.status(404).json({ message: "user doesn't exists" });

  //SIGN TOKEN
  jwt.sign(user, process.env.SECRET_TOKEN, async (error, token) => {
    if (error) {
      console.log(error);
    } else {
      // await User.updateOne(
      //   { phoneNumber: req.body.phoneNumber },
      //   { $set: { channel: req.body.channel } }
      // );
      myEmitter.emit("authenticated", token);
      res.cookie("token", `${token}`);

      res.status(200).json({ user, token: token });
    }
  });
});

//SUSPEND ACCOUNT
router.post("/users/suspend", async (req, res) => {
  console.log(req.body);

  if (typeof req.body.userId == "undefined") {
    return res.status(400).json({ message: "user Id missing" });
  }

  const account_result = await User.updateOne(
    { _id: req.body.userId },
    { $set: { accountStatus: "SUSPENDED" } }
  );
  //CHECK IF USER EXIST
  const userExist = await User.find({ _id: req.body.userId });
  return res
    .status(200)
    .json({ message: "account suspended", account: userExist[0] });

  //SIGN TOKEN
  jwt.sign(user, process.env.SECRET_TOKEN, async (error, token) => {
    if (error) {
      console.log(error);
    } else {
      // await User.updateOne(
      //   { phoneNumber: req.body.phoneNumber },
      //   { $set: { channel: req.body.channel } }
      // );
      myEmitter.emit("authenticated", token);
      res.cookie("token", `${token}`);

      res.status(200).json({ user, token: token });
    }
  });
});
router.post("/login", async (req, res) => {
  console.log(req.body);

  if (typeof req.body.uuid != "undefined") {
    const userExist = await User.find({ phoneNumber: req.body.phoneNumber });
    await User.updateOne(
      { phoneNumber: req.body.phoneNumber },
      { $set: { channel: req.body.uuid } }
    );
    return res.status(200).json({ message: req.body.uuid });
  }

  if (
    typeof req.body.phoneNumber == "undefined" ||
    typeof req.body.password == "undefined"
  )
    return res
      .status(403)
      .json({ message: "Phone number or password missing" });
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;

  //CHECK IF USER EXIST
  const userExist = await User.find({ phoneNumber: req.body.phoneNumber });

  if (userExist.length === 0)
    return res.status(404).json({ message: "user doesn't exists" });

  const loggedUser = userExist[0];

  //console.log(loggedUser);

  const user = {
    firstName: loggedUser.firstName,
    lastName: loggedUser.lastName,
    phoneNumber: loggedUser.phoneNumber,
    email: loggedUser.email,
    balance: loggedUser.balance,
    pool: loggedUser.pool,
    interestRate: loggedUser.interestRate,
    creditScore: loggedUser.creditScore,
    creditLimit: loggedUser.creditLimit,
    channel: loggedUser.channel
    //profilePicture: loggedUser.profilePicture
  };

  console.log(user);

  //VALIDATE PASSWORD
  const validpass = await bcryptjs.compare(password, userExist[0].password);
  if (!validpass) return res.status(401).json({ message: "invalid password" });

  //SIGN TOKEN
  jwt.sign(user, process.env.SECRET_TOKEN, async (error, token) => {
    if (error) {
      console.log(error);
    } else {
      // await User.updateOne(
      //   { phoneNumber: req.body.phoneNumber },
      //   { $set: { channel: req.body.channel } }
      // );
      myEmitter.emit("authenticated", token);
      res.cookie("token", `${token}`);

      res.status(200).json({ user, token: token });
    }
  });
});
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
