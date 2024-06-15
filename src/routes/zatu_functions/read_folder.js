const router = require("express").Router();
const ShopProduct = require("../../model/ShopProducts");

const Backupimage = require("../../model/BackUpImage");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs/promises");
const Jimp = require("jimp");
require("dotenv").config;


async function process_folder() {
  const back_number = await Backupimage.countDocuments();
  const folderPath = "./Public/products";
  const results = await fs.readdir(folderPath);

  if (results.length != back_number) {
    const shopProducts = await ShopProduct.find();

    for (let i = 0; i < shopProducts.length; i++) {
      const backupImage = await Backupimage.find({
        uuid: shopProducts[i].uuid
      });
      if (backupImage.length == 0) return;

      const data = backupImage[0].base64image;
      let buff = Buffer.from(data, "base64");

      const image = await Jimp.read(buff);
   
      await image.writeAsync(
        `Public/products/zatuwallet-${shopProducts[i].uuid}.jpg`
      );
   
    }
    console.log(`BACK UP RAN, ${shopProducts}`);
  }
  //console.log(results)
}

module.exports = process_folder;
