
const axios = require("axios");
require("dotenv").config;




async function smsFunction(message, phoneNumber, sendId) {
  const zamtelKey = process.env.ZAMTEL_KEY;


  //GENERATE SMS
  var session_url = `https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key/${zamtelKey}/contacts/26${phoneNumber}/senderId/${sendId}/message/${message}`;

  axios.get(session_url)
    .then(Response => {
      console.log(Response.data);
    })
    .catch(error => {
      console.log(error);
    });
}

module.exports = smsFunction;
