
const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');
const axios  = require("axios");

const User = require('../../model/User');
const bcryptjs = require("bcryptjs");

require('dotenv').config

router.post('/' ,async (req, res) => {



   
    console.log(req.body)

    
    
    
    /*
    //CREATE USER    
    const user = new User({
    
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email:req.body.email,
        password: harshedPassword
    
    })
    */
    
    
    //CHECK IF USER EXIST
    const phoneNumberExist = await User.find({phoneNumber: req.body.phoneNumber})
    
    if(phoneNumberExist.length > 0 ) return res.status(400).json({message: "phone number exists"});


        // HASH PASSWORD
        const salt = await bcryptjs.genSalt(10);
        const harshedPassword = await bcryptjs.hash(req.body.password, salt)
    


    const unique = uuidv4();

    const userphoneNumber= req.body.phoneNumber
    console.log(userphoneNumber)


    //GENERATE TOKEN MOMO
    var session_url = 'https://proxy.momoapi.mtn.com/collection/token/';
 
    var uname = process.env.MOMO_USER_NAME_COLLECTION_ACCOUNT;
    var pass = process.env.MOMO_PASSWORD_COLLECTION_ACCOUNT;
    const sub_key = process.env.SUB_KEY_COLLECTION_ACCOUNT
   
  
    axios.post(session_url,{}, {

        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': sub_key
                },
      auth: {
        username: uname,
        password: pass
            }
    }).then(async (Response) => {
        const access_token = Response.data.access_token
    
        var session_url = `https://proxy.momoapi.mtn.com/collection/v1_0/accountholder/msisdn/26${userphoneNumber}/basicuserinfo`;
    
       return await axios.get(session_url,{
        
        headers: {
    
      
            'X-Target-Environment':'mtnzambia',
      
            'Ocp-Apim-Subscription-Key' : sub_key,
            'Authorization': 'Bearer ' + access_token 
                  }
                
                
      })
    
    
    
    }).then((Response) => { 

        console.log(Response.data)
        
        //CREATE USER    
        const user = new User({
        
            firstName:Response.data.given_name,
            lastName:Response.data.family_name,
            phoneNumber: req.body.phoneNumber,
            email:req.body.email,
            password: harshedPassword
        
        })
        
        user.save()
       
        }).then(()=> res.status(201).json({messsage:"user sucessfully registered"}) )
        .catch((error) => {
            
            console.log(error)
          res.status(500).json({message:"failed to register"})
        
        
        })
    /*
   
    const access_token= dataV.data.access_token

 




    
    var session_url = `https://proxy.momoapi.mtn.com/collection/v1_0/accountholder/msisdn/26${userphoneNumber}/basicuserinfo`;
    
    axios.get(session_url,{
    
    headers: {

  
        'X-Target-Environment':'mtnzambia',
  
        'Ocp-Apim-Subscription-Key' : sub_key,
        'Authorization': 'Bearer ' + access_token 
              }
            
            
  }).then((Response) => {  //CREATE USER    
    const user = new User({
    
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email:req.body.email,
        password: harshedPassword
    
    })
    
    
    res.status(200).json({message: Response.data})
    } )
  .catch((error) => {
        
        console.log(error)
      res.status(400).send(error)
    
    
    })
      

       */ 
    


})


module.exports = router;