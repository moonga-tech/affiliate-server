//IMPORTS
const router = require("express").Router();
const { v4: uuidv4 } = require('uuid');

require('dotenv').config



router.get('/' , (req, res) => {

    const unique = uuidv4()
    
    
 
res.status(200).json({uuid: unique})
        
    

 
})





module.exports = router;