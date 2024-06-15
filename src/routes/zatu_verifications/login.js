const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../../model/User");
const Affiliate_Link = require("../../model/GeneratedLinks");
const { myEmitter } = require("../streams/streams");
const { urlencoded } = require("express");
require("dotenv").config;

router.post("/", async (req, res) => {
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
  const link = await Affiliate_Link.find({ phoneNumber: req.body.phoneNumber });
  console.log(link);

  if (userExist.length === 0)
    return res.status(404).json({ message: "user doesn't exists" });
  let link_ = "";
  let linkViews = 0;
  const loggedUser = userExist[0];
  if (link.length != 0) {
    link_ = link[0].link;
    linkViews = link[0].clicks;
  } else {
    link_ = "";
  }
  console.log(loggedUser);

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
    channel: loggedUser.channel,
    link: link_,
    linkViews: linkViews
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
      res.cookie("token", `${token}`);
      myEmitter.emit("authenticated", token);

      res.status(200).json({ user, token: token });
    }
  });
});

module.exports = router;
