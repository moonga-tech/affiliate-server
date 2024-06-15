
var express = require('express')
var multer  = require('multer')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

const cloudinary = require("cloudinary").v2;

const fs = require('fs')
          

// cloudinary configuration
cloudinary.config({
  cloud_name: "domn2x6oa",
  api_key: "545371755686151",
  api_secret: "QztKt-Xc06vBibMscKxHkb8k1sk"
});

async function uploadToCloudinary(locaFilePath) {
  // locaFilePath :
  // path of image which was just uploaded to "uploads" folder

  var mainFolderName = "main"
  // filePathOnCloudinary :
  // path of image we want when it is uploded to cloudinary
  var filePathOnCloudinary = mainFolderName + "/" + locaFilePath

  return cloudinary.uploader.upload(locaFilePath,{"public_id":filePathOnCloudinary})
  .then((result) => {
    // Image has been successfully uploaded on cloudinary
    // So we dont need local image file anymore
    // Remove file from local uploads folder 
    fs.unlinkSync(locaFilePath)
    
    return {
      message: "Success",
      url:result.url
    };
  }).catch((error) => {
    // Remove file from local uploads folder 
    fs.unlinkSync(locaFilePath)
    return {message: "Fail",};
  });
}



app.post('/profile-upload-single', upload.single('profile-file'), async (req, res, next) => {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  var locaFilePath = req.file.path
  var result = await uploadToCloudinary(locaFilePath)


  return res.send(response)
})

app.post('/profile-upload-multiple', upload.array('profile-files', 12), async (req, res, next) => {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    var imageUrlList = []
    
    for(var i=0;i<req.files.length;i++){
      var locaFilePath = req.files[i].path
      var result = await uploadToCloudinary(locaFilePath)
      imageUrlList.push(result.url)
    }
    var response = buildSuccessMsg(imageUrlList)
    
    return res.send(response)
})
   


