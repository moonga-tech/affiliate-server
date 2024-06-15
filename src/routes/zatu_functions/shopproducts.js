const router = require("express").Router();

const ShopProduct = require("../../model/ShopProducts");
const Backupimage = require("../../model/BackUpImage");
const process_image = require("../zatu_functions/process_image");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config;

router.post("/", verifyToken, async (req, res) => {
  console.log("SHOPn PRODUCTS hitttt", req.body);

  if (
    typeof req.body.shopId === "undefined" ||
    typeof req.body.products === "undefined"
  )
    return res
      .status(400)
      .json({ message: "products or shopId or sizesAvailable missing" });

  let products = [];
  let back_up_image = [];
  //Cloudinary.config().cloud_name

  for (let i = 0; i < req.body.products.length; i++) {
    const uniqueId = uuidv4();
    if (
      typeof req.body.products[i].price === "undefined" ||
      typeof req.body.products[i].productImage === "undefined" ||
      typeof req.body.products[i].sizesAvailable === "undefined"
    )
      return res.status(400).json({
        message: "image or price or sizesAvailable missing in array"
      });

    const data = String(req.body.products[i].productImage);
    let buff = Buffer.from(data, "base64");
    console.log("SHOPn NNNNNNNNNNNNNNNNNNNNNN", buff);

    const image = await Jimp.read(buff);
    console.log("SHOPn NNNNNNNNNNNNNNNNNNNNNN");
    await image.writeAsync(`Public/products/zatuwallet-${uniqueId}.jpg`);
    //CREATE SHOP PRODUCT
    const shopProducts = new ShopProduct({
      shopId: req.body.shopId,
      productImage: `https://zatuwallet.onrender.com/products/zatuwallet-${uniqueId}.jpg`,
      price: req.body.products[i].price,
      uuid: uniqueId,
      sizesAvailable: req.body.products[i].sizesAvailable
    });
    const backupImage = new Backupimage({
      uuid: uniqueId,
      url: `https://zatuwallet.onrender.com/products/zatuwallet-${uniqueId}.jpg`,
      base64image: req.body.products[i].productImage
    });
    console.log(backupImage);
    back_up_image.push(backupImage);
    products.push(shopProducts);
  }

  ShopProduct.bulkSave(products).then(onInsert);
  Backupimage.bulkSave(back_up_image).then(onInsert_);

  async function onInsert(response) {
    if (response.ok != 1) {
      return res.status(400).json({ message: "error occurred" });
    } else {
      //const kadi = await process_image(req,res);
      return res.status(201).json({ message: "upload successful" });
    }
  }

  async function onInsert_(response) {
    if (response.ok != 1) {
      console.log("UPLOAD TO BACK UP FAILED", response);
      //return res.status(400).json({ message:"error occurred" });
    } else {
      console.log("UPLOAD TO BACK UP SUCESSFUL", response);
      //const kadi = await process_image(req,res);
      //return res.status(201).json({ message: "upload successful" });
    }
  }
});

//RETRIEVE PRODUCTS FROM THE SHOP
router.post("/retrieve", async (req, res) => {
  console.log("RETRIVEm", req.body);

  if (typeof req.body.shopId === "undefined")
    return res.status(400).json({ message: "shopId is missing" });

  const retrieved_products = await ShopProduct.find({
    shopId: req.body.shopId
  });
  // console.log(retrieved_products)

  res.status(200).json({ message: retrieved_products });
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
