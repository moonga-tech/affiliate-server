//convertImage(String(base64Image))

const canvas = document.getElementById("canvas");
const canvas_container = document.getElementById("canvas-container");

/*
const ctx = canvas.getContext("2d")
ctx.font = "50px Roboto";
ctx.fillStyle = "red";
ctx.fillText("kadi", 100,100)
ctx.fillRect(200,150, 150,75)
*/



function convertImage (imagetoConvert){

    const ctx = canvas.getContext("2d")
    var product = new Image();
    var facebook = new Image();
    var whatsapp_icon = new Image();
    var mtn_icon = new Image();
    var zamtel_icon = new Image();
    var background = new Image();
    product.src = "./images/2718350267361278157.png"; //imagetoConvert;
    background.src  = "./images/background.jpg"
    facebook.src = "./images/facebook.png"
    whatsapp_icon.src = "./images/whatsapp_icon.png"
    mtn_icon.src = "./images/mtn_icon.jpg"
    zamtel_icon.src = "./images/zamtel_icon.png"
    product.onload = function (){
      
      ctx.drawImage(background, 0, 280, 300, 470)
      ctx.drawImage(product, 0, 0, 300, 280)
      ctx.drawImage(facebook, 10, 320, 30, 30)
      ctx.drawImage(whatsapp_icon, 10, 360, 30, 30)
    
      ctx.drawImage(mtn_icon, 120, 430, 30, 30)
      ctx.drawImage(zamtel_icon, 160, 430, 30, 30)
    
    
        //FONTS AND COLOR
      ctx.font = "12px Roboto";
      ctx.fillStyle = "black";
    
    
    
      //FIRST SECTION
      ctx.beginPath()
      ctx.moveTo(293, 315)
      ctx.lineTo(7, 315)
      ctx.stroke();
    
      //SECOND SECTION
      ctx.beginPath()
      ctx.moveTo(293, 425)
      ctx.lineTo(7, 425)
      ctx.stroke();
      ctx.fillText("Price",10, 310,)
    
      //ctx.lineWidth = 1;
      ctx.lineWidth = 1;
      ctx.strokeText("ZMW 850",45, 310)
      ctx.fillText("Page Name:",45, 340,)
      ctx.fillText("Deego Stores:",110, 340,)
      ctx.fillText("Deego Stores:",110, 340,)
      ctx.fillText("+260971067790",46, 380,)
     
    
      ctx.fillText("Pay With Zatu Wallet",12, 450,)
      ctx.fillText("Pay With Zatu Wallet",12, 450,)
    
       const dataUrl = canvas.toDataURL();
    
       console.log(dataUrl, "MASTER YOU HAVE ARRIVED")
    
       return dataUrl;
    
    
    
    
    }
    
    
    
  }