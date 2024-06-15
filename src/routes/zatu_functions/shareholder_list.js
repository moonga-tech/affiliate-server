const router = require("express").Router();
const Shareholders = require("../../model/shareholder");



router.get("/", async (req, res) => {
  console.log("shares")

    const shareholder = await Shareholders.find()



    res.status(200).json({ message: shareholder });
  });


module.exports = router;