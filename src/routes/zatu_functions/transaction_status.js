
const router = require("express").Router();

const axios  = require("axios");


router.get('/:id' ,  async (req, res) => {


  const referenceId = req.params.id


      //GENERATE TOKEN MOMO
      var session_url = 'https://proxy.momoapi.mtn.com/collection/token/';
 
      var uname = process.env.MOMO_USER_NAME_COLLECTION_ACCOUNT;
      var pass = process.env.MOMO_PASSWORD_COLLECTION_ACCOUNT;
      const sub_key = process.env.SUB_KEY_COLLECTION_ACCOUNT
     
    
      const dataV = await axios.post(session_url,{}, {
  
          headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': sub_key
                  },
        auth: {
          username: uname,
          password: pass
              }
      })
      
     
      const access_token= dataV.data.access_token




    var session_url = `https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay/${referenceId}`;
    
  axios.get(session_url, {
    
    headers: {

      

        'X-Target-Environment':'mtnzambia',
  
        'Ocp-Apim-Subscription-Key' : sub_key,
        'Authorization': 'Bearer ' + access_token 
              }
            
            
  }).then(async (Response) => {
    console.log(Response.data)

    if(Response.data.status == "PENDING") return res.status(200).json({message: Response.data});

    if(Response.data.status == "FAILED"){

       //FAILED TRANSACTION SYNTAX
   const failed = {
    "financialTransactionId": Response.data.financialTransactionId,
       "externalId": Response.data.externalId,
       "amount": Response.data.amount,
       "currency": Response.data.currency,
       "payer": { "partyIdType": 'MSISDN', partyId: Response.data.payer.partyId},
       "payeeNote": Response.data.payeeNote,
     "status": Response.data.status,
   "reason": Response.data. reason
   }



   //SEND FAILED TRANSACTION TO CALLBACK
   const session_url ="http://localhost:600/api/v1/callback/momo";

         const callbackResponse = await axios.post(session_url, failed, {
            headers: {
              "Content-Type": "application/json"
         
            }
          });


          if(callbackResponse.status == 200){

            res.status(200).json({message: Response.data})

          }
 

    }else if(Response.data.status == "SUCCESSFUL"){
    
    //SUCCESSFUL TRANSACTION SYNTAX
      
    const sucessful = {
      "body": {
          "financialTransactionId": Response.data.financialTransactionId,
          "externalId": Response.data.externalId,
          "amount": Response.data.amount,
          "currency": Response.data.currency,
          "payer": {
              partyIdType: "MSISDN",
              "partyId": Response.data.payer.partyId
          },
          "payeeNote": Response.data.payeeNote,
          "status": "SUCCESSFUL"
      }
   }

  //SEND SUCESSFUL TRANSACTION TO CALLBACK

   const session_url ="http://localhost:600/api/v1/callback/momo";

   const callbackResponse = await  axios.post(session_url, sucessful, {
     headers: {
       "Content-Type": "application/json"
  
     }
   });

   if(callbackResponse.status == 200){

    res.status(200).json({message: Response.data})

  }

  }}).catch((error) => {
      
      console.log(error)
    res.status(404).json({message: "resource not found"})
  
  
  })
    


        
    


})


module.exports = router;



    //SUCCESSFUL TRANSACTION SYNTAX
      
    const sucessful = {
      "body": {
          "financialTransactionId": "3401481343",
          "externalId": "12345",
          "amount": "1",
          "currency": "ZMW",
          "payer": {
              "partyIdType": "MSISDN",
              "partyId": "260766352686"
          },
          "payeeNote": "food",
          "status": "SUCCESSFUL"
      }
   }


   //FAILED TRANSACTION SYNTAX
   const failed = {
    financialTransactionId: '3666020829',
       externalId: 'd31e670c-7c46-4359-83ef-da635c694779',
       amount: '1',
       currency: 'ZMW',
       payer: { partyIdType: 'MSISDN', partyId: '260963274070'},
       payeeNote: 'd31e670c-7c46-4359-83ef-da635c694779',
     status: 'FAILED',
   reason: 'INTERNAL_PROCESSING_ERROR'
   }
 