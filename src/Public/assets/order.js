let products = [];
let clientphoneNumber = "";
let product_Image = "";
let base64Image = "";
//let quantity = "";
let purchase_order_receiver = "";

const UUIDGenerator = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] &
        (15 >> (c / 4)))).toString(16)
  );

//ADD button
const add = document.getElementById("add_product");

//LOADING CONTAINER
const loadingContainer = document.getElementById("loading-container");

//MISSING POR CONTAINER
const missing_order_number_container = document.getElementById(
  "missing-order-number-container"
);

//MODAL CONTAINER
const modalContainer = document.getElementById("modal-container");

//MODAL BUTTON(okay -SUCCESSFUL TRANSACTION)
const okaysuccessfulButton = document.getElementById("okay-successful");

//USER INPUTDETAILS CONTAINER
const user_details_container = document.getElementById(
  "user_input_details_container"
);

//SHOW PRODUCT INPUT DETAILS
const floating_button = document.getElementById("floating_button");

//SIZE INPUTS
const sizeInputs = document.getElementById("sizes_inputs");

const fileInputs = document.getElementById("file_inputs");

const productlistContainer = document.getElementById("product_list");
const inputdetailsContainer = document.getElementById(
  "input_details_container"
);
const empty_product_subtitle = document.getElementById(
  "empty_product_subtitle"
);
const empty_product_title = document.getElementById("empty_product_title");
const cancel_add_product = document.getElementById("cancel_add_product");
const purchase_order_button_holder = document.getElementById(
  "purchase_order_button_holder"
);
const register_user_button = document.getElementById("register_user_button");
const purchase_order_button = document.getElementById("purchase_order_button");
const phone_number_input = document.getElementById("phone_number_input");

const user_input_details_container = document.getElementById(
  "user_input_details_container"
);

//FUNCTIONS

//HIDE MODALS( successful transaction has occurred)
okaysuccessfulButton.addEventListener("click", function() {
  loadingContainer.classList.replace(
    "loading-container",
    "loading-container-after"
  );
  modalContainer.classList.replace("modal-container", "modal-container-after");
  location.reload();
});

register_user_button.addEventListener("click", () => {
  document.cookie = `phonenumber=${phone_number_input.value}`;

  user_input_details_container.style.visibility = "hidden";

  alert("successfully registered");
});

floating_button.addEventListener("click", () => {
  inputdetailsContainer.style.visibility = "visible";
});

cancel_add_product.addEventListener("click", () => {
  inputdetailsContainer.style.visibility = "hidden";
});

purchase_order_button.addEventListener("click", sendpurchaseOrder);

sizeInputs.addEventListener("input", () => {
  console.log(sizeInputs.value);

  var siszes = `${sizeInputs.value}`;
  const quantity = siszes.trim();
  const numberofSizes = quantity.split(",");
  quanity = numberofSizes.length;

  console.log("QUANTITY OF PRODUCTS", numberofSizes.length);
});

fileInputs.addEventListener("change", () => {
  const file = fileInputs.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    base64Image = reader.result;

    product_Image = String(base64Image);

    //console.log(product_Image);
  });
  reader.readAsDataURL(file);
});


//ADD PRODUCT
add.addEventListener("click", function() {
  let cookies = document.cookie.split(";");
  console.log(cookies);
  
  cookies.forEach(client => {


    if (client.match("phonenumber")) {
      clientphoneNumber = client.split("=")[1];
      if (clientphoneNumber.length == 0) {
        user_input_details_container.style.visibility = "visible";
      } else {
        user_input_details_container.style.visibility = "hidden";
      }
    }
  });
  empty_product_subtitle.style.display = "none";
  empty_product_title.style.display = "none";

  const uuuid = UUIDGenerator();

  const sizesWanted = `${sizeInputs.value}`;

  if (sizesWanted.length == 0) {
    alert("files can't be empty");

    return;
  }

  const quantity = sizesWanted.split(",").length
  console.log(sizesWanted);

  const product = {
    sizesWanted: sizesWanted,
    productImage: product_Image,
    status: "PENDING",
    productId: uuuid,
    quantity: quantity,
    creator: clientphoneNumber
  };

  products.push(product);

  console.log(products);
  productlistContainer.innerHTML = "";
  products.forEach(product => {
    //CREATE DIV
    var div = document.createElement("div");

    productlistContainer.appendChild(div);

    var html = `
      <div class="product_contents">
        <div class="image_holder">
          <img src="${product.productImage}" alt="" width="60" height="60" />
        </div>
        <div class="product_details_holder">
          <span class="product_details_titles">sizes wanted: ${product.sizesWanted}</span>
          <span class="product_details_titles">quanity: ${product.quantity}</span>

        </div>
      </div>
    `;

    div.insertAdjacentHTML("beforebegin", html);
  });

  inputdetailsContainer.style.visibility = "hidden";
  empty_product_title.style.visibility = "hidden";
  purchase_order_button_holder.style.visibility = "visible";

  //RESET ITEMS
  sizeInputs.value = "";

  fileInputs.value = null;
});

function sendpurchaseOrder() {

  let cookies = document.cookie.split(";");
  console.log(cookies);
  
  cookies.forEach(client => {


    if (client.match("phonenumber")) {
      clientphoneNumber = client.split("=")[1];
      if (clientphoneNumber.length == 0) {
        user_input_details_container.style.visibility = "visible";
      } else {
        user_input_details_container.style.visibility = "hidden";
      }
    }
  });

  console.log("zzzzzzzzz", clientphoneNumber)
  loadingContainer.classList.replace(
    "loading-container-after",
    "loading-container"
  );

  console.log(products);
  const url = `https://www.zatuwallet.com/api/v1/orders`;
  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      receiver: purchase_order_receiver,
      sender: clientphoneNumber,
      products: products
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(Response => Response.json())
    .then(data => {
      console.log(data.status);

      if (data.status == "successfull") {
        productlistContainer.innerHTML = "";
        loadingContainer.classList.replace(
          "loading-container",
          "loading-container-after"
        );
        modalContainer.classList.replace(
          "modal-container-after",
          "modal-container"
        );
      } else {
        loadingContainer.classList.replace(
          "loading-container",
          "loading-container-after"
        );

        alert("Fatal error occured. Kindly try again");
      }
    })
    .catch(error => {
      loadingContainer.classList.replace(
        "loading-container",
        "loading-container-after"
      );

      modalContainer.classList.replace(
        "modal-container",
        "modal-container-after"
      );
      alert("Fatal error. Make sure you have internet");
      console.error("Error:", error);
    });
}

//ON LOAD
window.onload = function() {
  let cookies = document.cookie.split(";");
console.log(cookies);


  cookies.forEach(client => {


    if (client.match("phonenumber")) {
      clientphoneNumber = client.split("=")[1];
      if (clientphoneNumber.length == 0) {
        user_input_details_container.style.visibility = "visible";
      } else {
        user_input_details_container.style.visibility = "hidden";
      }
    }
  });
  const urlDetails = window.location.search;

  const urlParams = new URLSearchParams(urlDetails);

  purchase_order_receiver = urlParams.get("por");

  console.log(purchase_order_receiver);

  if (purchase_order_receiver == null) {
    missing_order_number_container.classList.replace(
      "loading-container-after",
      "order-number-container"
    );
  }
};
