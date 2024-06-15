const router = require("express").Router();
//const Order = require("../../model/OrderRequests");
const Jimp = require("jimp");
const Shop = require("../../model/Shop");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
require("dotenv").config;

router.post("/", async (req, res) => {
  let product_list = [];
  console.log(" PROCESSmh  PICTURE ", req.body);

  const products = req.body.products;
  const creator = req.body.shopId;


  //console.log(products[1].key)
  //return res.status(201).json({ status: products });
  try {
    const backgroundimage = await Jimp.read("backgroundimage.jpg");
    console.log(" PROCESSmh PICTURE mmmmmmmmmm");
    //LOOP THROUGH PRODUCTS
    for (let i = 0; i < products.length; i++) {
      const uniqueId = uuidv4();
      const data = String(products[i].productImage);

      let buff = Buffer.from(data, "base64");

      const image = await Jimp.read(buff);

      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      const productImage = image.resize(672, 650);

      const processedImage = backgroundimage
        .composite(productImage, 0, 0)
        .print(font, 20, 690, `PRICE: ZMW ${products[i].price}`)
        .print(font, 20, 750, `SIZES: ${products[i].sizesAvailable}`)
        .print(font, 140, 1040, creator);

      processedImage.write(`Public/whatsapp/zatuwallet-${uniqueId}.jpg`);
      //const base64Data = await processedImage.getBase64Async(Jimp.MIME_PNG);

      const product_object = {
        productImage: `https://zatuwallet.onrender.com/whatsapp/zatuwallet-${uniqueId}.jpg`
      };
      product_list.push(product_object);
    }

    res.status(201).json({ message: product_list });
  } catch (error) {
    console.log(error, "Failed to process images");
    res.status(500).json({message:"failed to process images"});
  }
});

module.exports = router;
