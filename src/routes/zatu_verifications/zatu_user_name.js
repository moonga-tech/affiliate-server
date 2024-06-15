
const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');
const axios  = require("axios");
const User = require("../../model/User");


router.get('/:id' , async (req, res) => {


    const unique = uuidv4();

    const userphoneNumber= req.params.id

       //GET USER DETAILS
       const userDetails = await User.find({ phoneNumber: userphoneNumber });

        //CHECK IF SENDER EXIST
      if (userDetails.length == 0)
      return res.status(403).json({ message: "user doesn't exists" });
      
       console.log(userDetails);
       const receiver = userDetails[0];


       const userNames = ({
        firstName: receiver.firstName,
        lastName: receiver.lastName,
    
      });
    
res.status(200).json({user: userNames})

})


module.exports = router;