require("dotenv").config;

const Shareholder  = require("../../model/shareholder");
const axios = require("axios");
async function smsShareholdres() {
  console.log("SHARE HOLDER");
  const zamtelKey = process.env.ZAMTEL_KEY;
  const shareholders = [
    {
      phoneNumber: "260963274070",
      firstName: "Dibwa",
      lastName: "kabengele",
      shares: 6000
    },
   
    

    {
      phoneNumber: "260975576862",
      firstName: "Aness",
      lastName: "Lungu",
      shares: 387
    },
    {
      phoneNumber: "260976891486",
      firstName: "Arron",
      lastName: "Mwanza",
      shares: 5
    },
    {
      phoneNumber: "260974081103",
      firstName: "...",
      lastName: "Banda",
      shares: 5
    },

    {
      phoneNumber: "260962085424",
      firstName: "Charity",
      lastName: "Limula",
      shares: 100
    },

    {
      phoneNumber: "260964800855",
      firstName: "Ernest",
      lastName: "Sakala",
      shares: 387
    },

    {
      phoneNumber: "260978833930",
      firstName: "Gilbert C",
      lastName: "Mwansa",
      shares: 387
    },

    {
      phoneNumber: "260763341503",
      firstName: "Harry",
      lastName: "Nkole",
      shares: 387
    },
    {
      phoneNumber: "260978987086",
      firstName: "Jeff",
      lastName: "Mulenga",
      shares: 100
    },

    {
      phoneNumber: "260977977059",
      firstName: "...",
      lastName: "Mukosa",
      shares: 387
    },
    {
      phoneNumber: "260962803787",
      firstName: "Martin",
      lastName: "Mwila",
      shares: 387
    },

    {
      phoneNumber: "260970832565",
      firstName: "Mazuba",
      lastName: "Kadenda",
      shares: 387
    },

    {
      phoneNumber: "260976905796",
      firstName: "Mercy",
      lastName: "Chuuzya",
      shares: 387
    },

    {
      phoneNumber: "260979577457",
      firstName: "Moses",
      lastName: "Mudolo",
      shares: 387
    },

    {
      phoneNumber: "260961239218",
      firstName: "Jabulani",
      lastName: "Nkhata",
      shares: 487
    },

    {
      phoneNumber: "260953340230",
      firstName: "Nonde",
      lastName: "Salimu",
      shares: 487
    },

    {
      phoneNumber: "260963427503",
      firstName: "Roger",
      lastName: "Mwiinga",
      shares: 387
    },

    {
      phoneNumber: "260978671833",
      firstName: "Arron",
      lastName: "Simukoko",
      shares: 387
    },

    {
      phoneNumber: "260978939484",
      firstName: "Steez",
      lastName: "Chilekwa",
      shares: 20
    },

    {
      phoneNumber: "260963332918",
      firstName: "Steve",
      lastName: "Mupeta",
      shares: 32
    },

    {
      phoneNumber: "260967316163",
      firstName: "Vincent",
      lastName: "Chanda",
      shares: 387
    },

    {
      phoneNumber: "260954123900",
      firstName: "Zainabu",
      lastName: "Ngombe",
      shares: 5
    }
  ];

  for (var i = 0; i < shareholders.length; i++) {



   const save_shareholder = new Shareholder({

    firstName: shareholders[i].firstName,
    lastName: shareholders[i].lastName,
    shares: shareholders[i].shares,
    phoneNumber:shareholders[i].phoneNumber,
    debttoCompany: 5000
   });

    const message = encodeURIComponent(
      `Dear shareholder, kindly visit the link https://shopmanager-n7yf.onrender.com/qrcode.html to generate your QR code`
    );
 
    try {

     // await save_shareholder.save();
      console.log("SUCCESS");



   //console.log(kadi)
      //GENERATE SMS
      var session_url = `https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key/${zamtelKey}/contacts/${shareholders[
        i
      ].phoneNumber}/senderId/LemGroupLtd/message/${message}`;

      const response = await axios.get(session_url);
  console.log("SUCCESS",response);
   
    } catch (error) {
      console.log(error, "FAILED");

      break;
    }
  }
}



module.exports = smsShareholdres;
