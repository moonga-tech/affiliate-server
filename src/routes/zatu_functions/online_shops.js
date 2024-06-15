const router = require("express").Router();
const Invoice = require("../../model/invoice");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

require("dotenv").config;

router.get("/", async (req, res) => {
  console.log("online shop hit");

  const shops = [
    {
      category: "Grocery Store",
      phoneNumber: "0963274070",
      icon: "images/shoprite.jpg",
      shopName: "Shop Rite"
    },
    {
      category: "Restaurant",
      phoneNumber: "0963274070",
      icon: "images/checkers.jpg",
      shopName: "Checkers Restautant"
    },
    {
      category: "Clothing store",
      phoneNumber: "0963274070",
      icon: "images/pep.png",
      shopName: "Pep Stores"
    },
    {
      category: "Clothing store",
      phoneNumber: "0963274070",
      icon: "images/pep.png",
      shopName: "Pep Stores"
    },
    {
      category: "Clothing store",
      phoneNumber: "0963274070",
      icon: "images/pep.png",
      shopName: "Pep Stores"
    },
    {
      category: "Clothing store",
      phoneNumber: "0963274070",
      icon: "images/pep.png",
      shopName: "Pep Stores"
    },
    {
      category: "Clothing store",
      phoneNumber: "0963274070",
      icon: "images/pep.png",
      shopName: "Pep Stores"
    },
    {
      category: "Clothing store",
      phoneNumber: "0963274070",
      icon: "images/pep.png",
      shopName: "Pep Stores"
    },
    {
      category: "Clothing store",
      phoneNumber: "0963274070",
      icon: "images/pep.png",
      shopName: "Pep Stores"
    },
    {
      category: "Clothing store",
      phoneNumber: "0963274070",
      icon: "images/pep.png",
      shopName: "Pep Stores"
    },
    {
      category: "Clothing store",
      phoneNumber: "0963274070",
      icon: "images/pep.png",
      shopName: "Pep Stores"
    },
    {
      category: "Clothing store",
      phoneNumber: "0963274070",
      icon: "images/pep.png",
      shopName: "Pep Stores"
    }
  ];

  res.status(200).json({ message: shops});
});

module.exports = router;
