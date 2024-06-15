
const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');
const axios  = require("axios");


router.get('/:id' ,async (req, res) => {


    const unique = uuidv4();

    const userphoneNumber= req.params.id
    console.log(userphoneNumber)


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

 




    
    var session_url = `https://proxy.momoapi.mtn.com/collection/v1_0/accountholder/msisdn/26${userphoneNumber}/basicuserinfo`;
    
    axios.get(session_url,{
    
    headers: {

  
        'X-Target-Environment':'mtnzambia',
  
        'Ocp-Apim-Subscription-Key' : sub_key,
        'Authorization': 'Bearer ' + access_token 
              }
            
            
  }).then((Response) =>  res.status(200).json({message: Response.data}))
  .catch((error) => {
        
        console.log(error)
      res.status(400).send(error)
    
    
    })
      

        
    


})


module.exports = router;