const router = require("express").Router();
const Otp = require("../../model/otp");
const bcryptjs = require("bcryptjs");
const axios = require("axios");
const User = require("../../model/User");
require("dotenv").config;

router.post("/", async (req, res) => {
  console.log("pin  reset");
  console.log(req.body);
  if (
    typeof req.body === "undefined" ||
    typeof req.body.phoneNumber === "undefined"
  )
    return res.status(400).json({ message: "phone number missing" });

  await Otp.findOneAndDelete({ phoneNumber: req.body.phoneNumber });

  const otpCode = Math.floor(Math.random() * 1000000);
  //CREATE USER
  const otp = new Otp({
    phoneNumber: req.body.phoneNumber,
    pin: otpCode
  });

  console.log(otp);

  const message = `Your reset OTP reset code is ${otp.pin}`;

  //SEND CALLBACK MESSAGE
  const zamtelKey = process.env.ZAMTEL_KEY;
  var session_url = `https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key/${zamtelKey}/contacts/26${otp.phoneNumber}/senderId/ZatuWallet/message/${message}`;

  axios
    .get(session_url)
    .then(Response => {
      console.log(Response);

      if (Response.status != 202) {
        console.log("error sending sms");
        return res.status(500).json({ message: "Error sending Pin" });
      }
    })
    .catch(Error => {
      console.log(Error);
      return res.status(500).json({ message: "Error sending Pin" });
    });

  try {
    await otp.save();
    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.log(error, "Failed to register user");
    res.status(500).json({ message: "Error sending Pin" });
  }
});

router.post("/pin", async (req, res) => {
  console.log("pin  reset");
  console.log(req.body);
  if (
    typeof req.body === "undefined" ||
    typeof req.body.phoneNumber === "undefined" ||
    typeof req.body.pin === "undefined" ||
    typeof req.body.password === "undefined"
  )
    return res.status(400).json({ message: "password or phone number or pin missing" });

  //CHECK IF USER EXIST
  const otp = await Otp.find({
    phoneNumber: req.body.phoneNumber
  });
  console.log(otp);
  if (otp.length == 0) return res.status(400).json({ message: "Wrong Pin" });

  if (otp[0].pin != req.body.pin)
    return res.status(400).json({ message: "wrong reset pin" });

  try {
    // HASH PASSWORD
    const salt = await bcryptjs.genSalt(10);
    const harshedPassword = await bcryptjs.hash(req.body.password, salt);

    await User.updateOne(
      { phoneNumber: req.body.phoneNumber },
      { $set: { password: harshedPassword } }
    );

    otp[0].delete();

    res.status(200).json({ message: "password reset" });
  } catch (error) {
    console.log(error, "Failed to reset password");
    res.status(500).json({ message: "Error resetting Pin" });
  }
});

module.exports = router;
