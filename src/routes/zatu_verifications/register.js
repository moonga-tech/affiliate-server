const router = require("express").Router();
const GeneratedLink = require("../../model/GeneratedLinks");
const bcryptjs = require("bcryptjs");
const User = require("../../model/User");
const Gamer = require("../../model/Gamer");
require("dotenv").config;



router.post("/", async (req, res) => {
  console.log("register route");
  console.log(req.body);
  if (
    typeof req.body.phoneNumber == "undefined" ||
    typeof req.body.password == "undefined" ||
    typeof req.body.firstName == "undefined" ||
    typeof req.body.lastName == "undefined"
  )
    return res.status(400).json({ message: "fill out all the details" });

  if (String(req.body.phoneNumber).length >= 11)
    return res.status(400).json({ message: "Number is not valid" });

  // HASH PASSWORD
  const salt = await bcryptjs.genSalt(10);
  const harshedPassword = await bcryptjs.hash(req.body.password, salt);

  const firstName = String(req.body.firstName).toUpperCase();
  const lastName = String(req.body.lastName).toUpperCase();

  //CREATE USER
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    password: harshedPassword
  });

  //CHECK IF USER EXIST
  const phoneNumberExist = await User.find({
    phoneNumber: req.body.phoneNumber
  });

  if (phoneNumberExist.length > 0)
    return res.status(401).json({ message: "phone number already exists" });

  try {
    const savedUser = await user.save();
    res.status(201).json({ message: "user successfully registered" });
  } catch (error) {
    console.log(error, "Failed to register user");
    res.status(500).send(error);
  }
});

router.post("/model", async (req, res) => {
  console.log("register route");
  console.log(req.body);
  if (
    typeof req.body.fullNames == "undefined" ||
    typeof req.body.phoneNumber == "undefined" ||
    typeof req.body.age == "undefined" ||
    typeof req.body.shoeSize == "undefined" ||
    typeof req.body.dressSize == "undefined"
  )
    return res.status(400).json({ message: "fill out all the details" });

  if (String(req.body.phoneNumber).length >= 11)
    return res.status(400).json({ message: "Number is not valid" });

  //CREATE USER
  const user = new GeneratedLink({
    fullNames: req.body.fullNames,
    phoneNumber: req.body.phoneNumber,
    age: req.body.age,
    shoeSize: req.body.shoeSize,
    dressSize: req.body.dressSize,
    facebook: req.body.facebook,
    tiktok: req.body.tiktok,
    instagram: req.body.instagram
  });

  //CHECK IF USER EXIST
  const phoneNumberExist = await GeneratedLink.find({
    phoneNumber: req.body.phoneNumber
  });

  if (phoneNumberExist.length > 0)
    return res.status(401).json({ message: "phone number already exists" });

  try {
    const savedUser = await user.save();

    res.status(201).json({ message: "user successfully registered" });
  } catch (error) {
    console.log(error, "Failed to register user");
    res.status(500).send(error);
  }
});

router.post("/gamers", async (req, res) => {
  console.log("gamer route");
  console.log(req.body);
  if (
    typeof req.body.fullNames == "undefined" ||
    typeof req.body.phoneNumber == "undefined" ||
    typeof req.body.age == "undefined"
  )
    return res.status(400).json({ message: "fill out all the details" });

  if (String(req.body.phoneNumber).length >= 11)
    return res.status(400).json({ message: "Number is not valid" });

  //CREATE USER
  const user = new Gamer({
    fullNames: req.body.fullNames,
    phoneNumber: req.body.phoneNumber,
    age: req.body.age
  });

  //CHECK IF USER EXIST
  const phoneNumberExist = await Gamer.find({
    phoneNumber: req.body.phoneNumber
  });

  if (phoneNumberExist.length > 0)
    return res.status(401).json({ message: "phone number already exists" });

  try {
    const savedUser = await user.save();

    res.status(201).json({ message: "Gamer successfully registered" });
  } catch (error) {
    console.log(error, "Failed to register user");
    res.status(500).send(error);
  }
});

router.post("/link", async (req, res) => {
  console.log("generate linl route");
  console.log(req.body);
  if (typeof req.body.phoneNumber == "undefined")
    return res.status(400).json({ message: "fill out all the details" });

  //CHECK IF USER EXIST
  const phoneNumberExist = await GeneratedLink.find({
    phoneNumber: req.body.phoneNumber
  });

  console.log(phoneNumberExist);

  if (phoneNumberExist.length == 0) {
    const linkObject = new GeneratedLink({
      phoneNumber: req.body.phoneNumber,
      link: `www.zatuwallet.com/shops.html?aid=${req.body.phoneNumber}`
    });
    try {
      const results = await linkObject.save();
      return res
        .status(201)
        .json({ message: "link sucessfully generated", link: results });
    } catch (error) {
      console.log(error, "Failed to create link");
      res.status(500).send(error);
    }
  }
});

module.exports = router;
