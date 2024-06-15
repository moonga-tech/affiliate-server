let scrollPos = 0;
let clientphoneNumber = "";
let product_id = "";
let cart_products = [];
////////////////////////////////////////////////////////////////

const initiate_transaction_container = document.getElementById(
  "initiate_transaction_container"
);
const buyer_phone_input = document.getElementById("buyer_phone_input");
const initiate_transaction_button = document.getElementById(
  "initiate_transaction_button"
);
const loading_container_transaction = document.getElementById(
  "loading_container_transaction"
);
const okay_successful = document.getElementById("okay_successful");
const okay_failed = document.getElementById("okay_failed");
const failed_transaction_modal_container = document.getElementById(
  "failed_transaction_modal_container"
);
const successful_modal_container_transaction = document.getElementById(
  "successful_modal_container_transaction"
);
const cart_container_icon = document.getElementById("cart_container_icon");
const pay_button = document.getElementById("pay_button");
const empty_shop_container = document.getElementById("empty_shop_container");
const cancel_modal_cart_list = document.getElementById(
  "cancel_modal_cart_list"
);
const cart_list_container = document.getElementById("list_container");
const cart_container = document.getElementById("cart_list_container_");
const client_details = document.getElementById("client_details");
const cards_container = document.getElementById("card_container");
const phone_number_log_in_inputs = document.getElementById(
  "phone_number_log_in_inputs"
);
const cart_item_number = document.getElementById("cart_item_number");
cart_item_number;
const sizes_wanted_inputs = document.getElementById("Sizes_wanted");
const verification_content_holder_class = document.querySelector(
  ".content_holder_verification"
);
const password_log_in_inputs = document.getElementById(
  "password_log_in_inputs"
);
const log_in_button = document.getElementById("log_in_button");
const sign_up_link_button = document.getElementById("sign_up_link_button");
const forgot_password = document.getElementById("forgot_password");
const verification_container = document.getElementById(
  "verification_container"
);
const log_in_content_holder = document.getElementById("log_in_content_holder");
const sign_up_content_holder = document.getElementById(
  "sign_up_content_holder"
);
const back_to_login = document.getElementById("back_to_login");
const first_name_inputs = document.getElementById("first_name_inputs");
const last_name_inputs = document.getElementById("last_name_inputs");
const phone_number_sign_up_inputs = document.getElementById(
  "phone_number_sign_up_inputs"
);
const password_inputs = document.getElementById("password_inputs");
const confirm_password_inputs = document.getElementById(
  "confirm_password_inputs"
);
const sign_up_button = document.getElementById("sign_up_button");
const loading_container = document.getElementById("loading_container");
const confirmation_button = document.getElementById("comfirm_button");
const cancel_button = document.getElementById("cancel_button");
const option_confirmation_class = document.querySelector(
  ".option_confirmation"
);
const foot = document.getElementById("foot");
const cancel_modal_button_transactions = document.getElementById(
  "cancel_modal_transactions"
);
const cancel_modal_button_delivery = document.getElementById(
  "cancel_modal_delivery"
);
const transaction_history_button = document.getElementById(
  "transaction_history"
);

const delivery_history_button = document.getElementById("delivery_history");

const transaction_history_container = document.getElementById(
  "transaction_history_container"
);
const delivery_history_container = document.getElementById(
  "delivery_history_container"
);

/////////////////////////////////////////////////////////////////////

//FUNCTIONS

initiate_transaction_button.addEventListener("click", async function() {
  if (buyer_phone_input.value == "")
    return alert("Kindly input the mobile number to transact from");

  const buyer = String(buyer_phone_input.value);
  let provider = "";
  if (buyer[2] == 7) {
    provider = 1;
  } else if (buyer[2] == 6) {
    provider = 2;
  } else if (buyer[2] == 5) {
    provider = 3;
  }
  let cookies = document.cookie.split(";");
  console.log(cookies[0]);

  const token = String(cookies).split("=")[1];

  const client_details = await parseJwt(token);
  console.log(client_details);
  const urlDetails = window.location.search;

  const urlParams = new URLSearchParams(urlDetails);

  const shopId = urlParams.get("shopId");

  if (shopId == null) return alert("Shop Id is missing");

  const url = "https://zatuwallet.onrender.com/api/v1/cart/retrieve";
  // const url = `http://localhost:600/api/v1/cart/payment`;
  const encoded = encodeURI(url);
  loading_container_transaction.classList.replace(
    "dismiss",
    "loading-container"
  );
  if ((provider = 2)) {
    let count = 0;
    let momocountdownNumber = 100;

    momocountDown = setInterval(() => {
      if (momocountdownNumber == 0) {
        clearInterval(momostatus);
        clearInterval(momocountDown);
        loading_container_transaction.classList.replace(
          "loading-container",
          "loading-container-after"
        );
        failed_transaction_modal_container.classList.replace(
          "failed-transaction-modal-container-after",
          "failed-transaction-modal-container"
        );
        return;
      }

      document.getElementById(
        "time_out_coutnt"
      ).innerText = --momocountdownNumber;
    }, 1000);
  }

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      phoneNumber: buyer_phone_input.value,
      cartId: client_details.phoneNumber,
      shopId: shopId,
      provider: provider
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      if (Response.status != 200) return alert("error processing payment");
      const json_Response = await Response.json();

      console.log(json_Response);
      //MOMO STATUS
      setTimeout(() => {
        momostatus = setInterval(() => {
          if (momocountdownNumber == 0) {
            clearInterval(momostatus);
            clearInterval(momocountDown);
            loading_container_transaction.classList.replace(
              "loading-container",
              "dismiss"
            );
            failed_transaction_modal_container.classList.replace(
              "dismiss",
              "failed-transaction-modal-container"
            );
            return;
          }

          //FETCH TRANSACTION STATUS`
          const urlUuuid = `https://zatuwallet.onrender.com/api/v1/transactionstatus/${json_Response
            .message.txnId}`;

          fetch(urlUuuid)
            .then(Response => Response.json())
            .then(data => {
              console.log(data.message);

              if (data.message.status == "SUCCESSFUL") {
                clearInterval(momostatus);
                clearInterval(momocountDown);

                loading_container_transaction.classList.replace(
                  "loading-container",
                  "dismiss"
                );
                successful_modal_container_transaction.classList.replace(
                  "dismiss",
                  "modal-container"
                );
              } else if (data.message.status == "FAILED") {
                clearInterval(momostatus);
                clearInterval(momocountDown);
                loadingContainer.classList.replace(
                  "loading-container",
                  "dismiss"
                );
                failedtransactionmodalContainer.classList.replace(
                  "dismiss",
                  "failed-transaction-modal-container"
                );
              }
            })
            .catch(error => {
              //alert("Fatal error occured")
              console.error("Error:", error);
            });

          count++;

          console.log(count, uuidglobal);
        }, 7000);
      }, 7000);

      // referesh_cart_details();
    })
    .catch(error => {
      alert("Error processing transaction");

      console.log("Error:", error);
    });
  console.log("xxxxxxxxxxxxx");
});

//DIMISS SUCCESSFUL TRANSACTION
okay_successful.addEventListener("click", function() {
  successful_modal_container_transaction.classList.replace(
    "dismiss",
    "cart_list_container"
  );
  loading_container_transaction.classList.replace(
    "dismiss",
    "cart_list_container"
  );
  console.log("xxxxxxxxxxxxx");
});
//DIMISS FAILED TRANSACTION
okay_failed.addEventListener("click", function() {
  failed_transaction_modal_container.classList.replace(
    "dismiss",
    "cart_list_container"
  );

  console.log("xxxxxxxxxxxxx");
});
cart_list_container.addEventListener("click", function() {
  // cart_container.classList.replace("dismiss", "cart_list_container");
  console.log("xxxxxxxxxxxxx");
});

//SHOW CART
cart_container_icon.addEventListener("click", referesh_cart_details);
//LOGIN
log_in_button.addEventListener("click", function() {
  const phoneNumber = String(phone_number_log_in_inputs.value);
  const password = String(password_log_in_inputs.value);

  if (phoneNumber.length == 0 || password.length == 0)
    return alert("Fill up all the inputs");
  loading_container.classList.replace("dismiss", "loading_container");

  //localhost:600/api/v1
  const url = `https://zatuwallet.onrender.com/api/v1/login`;
  // const url = `http://localhost:600/api/v1/login`;
  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      phoneNumber: phoneNumber,
      password: password
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      const json_Response = await Response.json();
      console.log(json_Response);
      if (Response.status != 200) {
        loading_container.classList.replace("loading_container", "dismiss");
        return alert(json_Response.message);
      }

      document.cookie = `token=${json_Response.token}; Path=/`;
      console.log(json_Response);
      client_details.innerHTML =
        json_Response.user.firstName + " " + json_Response.user.lastName;

      let cookies = document.cookie.split(";");
      //console.log(cookies[0]);

      const token = String(cookies).split("=")[1];

      if (typeof token != "undefined") {
        const client_details_ = parseJwt(token);
        client_details.innerHTML =
          client_details_.firstName + " " + client_details_.lastName;
        fetch_cart_products(client_details_.phoneNumber);
      }
      //close loading screen
      loading_container.classList.replace("loading_container", "dismiss");
      verification_container.classList.replace(
        "verification_container",
        "dismiss"
      );

      //close login screen
      //log_in_content_holder.classList.replace("log_in", "dismiss");

      //close sign up screen
      //sign_up_content_holder.classList.replace( "sign_up", "dismiss");
    })
    .catch(error => {
      alert("Fatal error occured while loggin in");

      // console.log("Error:", error);
    });
});

//HIDE LOGIN MODAL AND SHOW SIGN UP DIALOG
sign_up_link_button.addEventListener("click", function() {
  verification_content_holder_class.style.height = "50%";
  //close login screen
  log_in_content_holder.classList.replace("log_in", "dismiss");

  //show login screen
  //log_in_content_holder.classList.replace("dismiss", "log_in" );

  //show sign up screen
  sign_up_content_holder.classList.replace("dismiss", "sign_up");

  //hide sign up screen
  //sign_up_content_holder.classList.replace( "sign_up", "dismiss");
});

//FORGOT PASSWORD
forgot_password.addEventListener("click", function() {});

//SHOW LOGIN MODAL AND HIDE SHOW SIGN UP DIALOG
back_to_login.addEventListener("click", function() {
  verification_content_holder_class.style.height = "30%";
  log_in_content_holder.classList.replace("dismiss", "log_in");
  sign_up_content_holder.classList.replace("sign_up", "dismiss");
});

//SIGN UP
sign_up_button.addEventListener("click", function() {
  const firstName = String(first_name_inputs.value);
  const lastName = String(last_name_inputs.value);
  const phoneNumber = String(phone_number_sign_up_inputs.value);
  const password = String(password_inputs.value);
  const confirm_password = String(confirm_password_inputs.value);

  if (confirm_password != password) return alert("mismatched password");

  if (
    confirm_password.length == 0 ||
    password.length == 0 ||
    phoneNumber.length == 0 ||
    lastName.length == 0 ||
    firstName.length == 0
  )
    return alert("Fill out all inputs");
  loading_container.classList.replace("dismiss", "loading_container");
  //const url = `http://localhost:600/api/v1/user/register`;
  const url = `https://zatuwallet.onrender.com/api/v1/user/register`;
  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      password: password
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      const json_Response = await Response.json();

      console.log(json_Response, Response.status);
      if (Response.status == 400) {
        loading_container.classList.replace("loading_container", "dismiss");
        return alert(json_Response.message);
      } else if (Response.status == 201) {
        loading_container.classList.replace("loading_container", "dismiss");
        alert(json_Response.message);
        verification_content_holder_class.style.height = "30%";
        sign_up_content_holder.classList.replace("sign_up", "dismiss");

        log_in_content_holder.classList.replace("dismiss", "log_in");
      }
    })
    .catch(error => {
      loading_container.classList.replace("loading_container", "dismiss");
      alert("Fatal error occured while signing up");

      console.log("Error:", error);
    });
});

//CALCULATE SCROLL POSITION
window.addEventListener("scroll", checkPosition);
foot.addEventListener("click", function() {});
function checkPosition() {
  let windowY = window.scrollY;

  // console.log(windowY);
  if (windowY < scrollPos) {
    foot.classList.replace("dismiss", "foot");
  } else {
    foot.classList.replace("foot", "dismiss");
  }
  scrollPos = windowY;
}

//HIDE TRANSACTION HISTORY
cancel_modal_button_transactions.addEventListener("click", function() {
  option_confirmation_container.classList.replace(
    "option_confirmation",
    "dismiss"
  );
  transaction_history_container.classList.replace(
    "transaction_history_container",
    "dismiss"
  );
});

//HIDE DELIVERY HISTORY
cancel_modal_button_delivery.addEventListener("click", function() {
  option_confirmation_container.classList.replace(
    "option_confirmation",
    "dismiss"
  );
  delivery_history_container.classList.replace(
    "delivery_history_container",
    "dismiss"
  );
});

//SHOW DELIVERY HISTORY
transaction_history_button.addEventListener("click", function() {
  option_confirmation_container.classList.replace(
    "option_confirmation",
    "dismiss"
  );
  transaction_history_container.classList.replace(
    "dismiss",
    "transaction_history_container"
  );
});

//HIDE DELIVERY HISTORY DIALOG
delivery_history_button.addEventListener("click", function() {
  option_confirmation_container.classList.replace(
    "option_confirmation",
    "dismiss"
  );
  transaction_history_container.classList.replace(
    "transaction_history_container",
    "dismiss"
  );
  delivery_history_container.classList.replace(
    "dismiss",
    "delivery_history_container"
  );
});

//COMFIRMATION BUTTON
confirmation_button.addEventListener("click", function() {
  //console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
  const sizesWanted = String(sizes_wanted_inputs.value);
  if (sizesWanted == "") return alert("Sizes wanted missing");
  const verify_structure = sizesWanted.split(",");
  //console.log(verify_structure );
  verify_structure.forEach(sizes => {
    if (sizes == "")
      return alert(
        "Can't put comma at the end. Follow the format: shoes: 40,41,44 ... clothes: S,M,L,XL"
      );
  });

  const verify_sizeswanted = sizesWanted.search(",");
  console.log(verify_structure.length, " SSSSSSSSSSS");

  if (verify_sizeswanted == -1 && verify_structure.length > 1)
    return alert(
      "Make sure sizes are comma seperated e.g Shoes: 40,45  Clothes: S,M,L,XL"
    );
  // console.log(verify_sizeswanted);

  //console.log(product_id);
  //console.log(sizesWanted);

  loading_container.classList.replace("dismiss", "loading_container");
  const url = `https://zatuwallet.onrender.com/api/v1/user/register`;
  //const url = `http://localhost:600/api/v1/cart/add`;

  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      productId: product_id,
      sizesWanted: sizesWanted,
      buyer: "0971067790",
      seller: "0963274070"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      const json_Response = await Response.json();
      if (Response.status != 201) {
        loading_container.classList.replace("loading_container", "dismiss");
        return alert(json_Response.message);
      }
      cart_container_icon.classList.replace("cart", "box");
      setTimeout(() => {
        cart_container_icon.classList.replace("box", "cart");
      }, 2000);
      loading_container.classList.replace("loading_container", "dismiss");

      cart_products = json_Response.message;
      console.log(cart_products);
      cart_item_number.innerHTML = cart_products.length;
      sizes_wanted_inputs.value = "";
      //return alert(json_Response.message);
    })
    .catch(error => {
      loading_container.classList.replace("loading_container", "dismiss");
      alert("Fatal error occured while signing up");

      console.log("Error:", error);
    });
});

//CARDS CONTAINER - ADD TO CART - SHOW OPTIONS
cards_container.addEventListener("click", function(e) {
  product_id = e.target.id;
  //console.log(product_id);

  let cookies = document.cookie.split(";");
  console.log(cookies);
  if (cookies == "")
    return verification_container.classList.replace(
      "dismiss",
      "verification_container"
    );

  console.log(e.target.id);

  option_confirmation_container.classList.replace(
    "dismiss",
    "option_confirmation"
  );
});

//HIDE COMFIRMATION DIALOG
cancel_button.addEventListener("click", function() {
  option_confirmation_container.classList.replace(
    "option_confirmation",
    "dismiss"
  );
});

//REMOVE FROM CART AND SERVER
cart_list_container.addEventListener("click", function(e) {
  console.log(e.target.id);
  const url = "https://zatuwallet.onrender.com/api/v1/shopstorage/retrieve";
  // const url = `http://localhost:600/api/v1/cart/delete`;
  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      _id: e.target.id
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      console.log(Response.status);
      if (Response.status == 200) {
        const json_Response = await Response.json();

        console.log(json_Response);
        let cookies = document.cookie.split(";");
        //console.log(cookies[0]);

        const token = String(cookies).split("=")[1];
        //console.log(token);
        if (typeof token != "undefined") {
          const client_details_ = parseJwt(token);
          console.log(client_details_);
          fetch_cart_products(client_details_.phoneNumber);
          referesh_cart_details();
        }
      }
    })
    .catch(error => {
      console.log("Error: ..", error);
    });
});
//VERIFICATION CONTAINER
verification_container.addEventListener("click", function(e) {
  console.log(e.target.id);
  if (e.target.id == "verification_container")
    return verification_container.classList.replace(
      "verification_container",
      "dismiss"
    );
});

//hide cart
cancel_modal_cart_list.addEventListener("click", function() {
  cart_container.classList.replace("cart_list_container", "dismiss");
});

pay_button.addEventListener("click", function(e) {
  console.log(e.target.id);

  initiate_transaction_container.classList.replace(
    "dismiss",
    "initiate_transaction_container"
  );
});
//ON LOAD
window.onload = function() {
  let cookies = document.cookie.split(";");
  //console.log(cookies[0]);

  const token = String(cookies).split("=")[1];
  //console.log(token);
  if (typeof token != "undefined") {
    const client_details_ = parseJwt(token);
    client_details.innerHTML =
      client_details_.firstName + " " + client_details_.lastName;
  }

  const urlDetails = window.location.search;

  const urlParams = new URLSearchParams(urlDetails);

  const shopId = urlParams.get("shopId");

  console.log(shopId);

  const url = "https://zatuwallet.onrender.com/api/v1/shopstorage/retrieve";
  // const url = `http://localhost:600/api/v1/shopstorage/retrieve`;
  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      shopId: shopId
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      console.log(Response.status);
      if (Response.status == 200) {
        const json_Response = await Response.json();
        console.log(json_Response);
        var products = json_Response.message;

        if (products.length == 0)
          return empty_shop_container.classList.replace(
            "dismiss",
            "empty_shop_container"
          );

        let placeholder = document.getElementById("card_container");

        for (let i = 0; i < products.length; i++) {
          let div = document.createElement("div");
          div.classList.add( "card" );

          div.innerHTML = `
           <span class="product_id">${products[i]._id}</span>
           <img src="${products[i].productImage}" alt="" class="card_image" />
           <span class="product_name"> ZMW ${products[i].price}</span>
           <span class="product_sizes"> ${products[i].sizesAvailable}</span>
           <div class="button_container">
             <button class="add_to_cart" id="${products[i]
               ._id}">Add to cart</button>
           </div>
         `;

          placeholder.insertAdjacentElement("beforeend", div);
        }
        cart_item_number.innerHTML = cart_products.length;
        loading_container.classList.replace("loading_container", "dismiss");
        if (typeof token != "undefined") {
          const client_details_ = parseJwt(token);
          client_details.innerHTML =
            client_details_.firstName + " " + client_details_.lastName;
          fetch_cart_products(client_details_.phoneNumber);
        }
      }
    })
    .catch(error => {
      alert("Fatal error occured fetching dataa");

      console.log("Error: ..", error);
    });

  const url_event = `https://zatuwallet.onrender.com/stream?id=${shopId}`;
  // const url_event = `http://localhost:600/stream?id=${shopId}`;
  const eventSource = new EventSource(url_event);

  //EVENTS FROM SERVER

  //on connection
  eventSource.addEventListener("connection", e => {
    console.log(e);
  });
  //on connection
  eventSource.addEventListener("zatu", e => {
    const kadi = parseJwt(e.data);

    console.log(kadi);
  });

  eventSource.onmessage = function(event) {
    //console.log(event);
    if (event.data == "successful") {
      clearInterval(momostatus);

      loadingContainer.classList.replace(
        "loading-container",
        "loading-container-after"
      );
      modalContainer.classList.replace(
        "modal-container-after",
        "modal-container"
      );
      console.log(event.data);
    } else if (event.data == "failed") {
      clearInterval(momostatus);
      loadingContainer.classList.replace(
        "loading-container",
        "loading-container-after"
      );
      failedtransactionmodalContainer.classList.replace(
        "failed-transaction-modal-container-after",
        "failed-transaction-modal-container"
      );
      console.log(event.data);
    }
  };
  eventSource.onerror = function(event) {
    console.log(event.error);
  };
};

function parseJwt(token) {
  var base64Url = token.split(".")[1];

  var jsonPayload = decodeURIComponent(
    atob(base64Url)
      .split("")
      .map(c => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

//FETCH CART PRODUCTS
function fetch_cart_products(phoneNumber) {
  console.log(phoneNumber);
  const url = "https://zatuwallet.onrender.com/api/v1/cart/retrieve";
  //const url = `http://localhost:600/api/v1/cart/retrieve`;
  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      phoneNumber: phoneNumber
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      if (Response.status != 200) return alert("Error fetching cart");
      const json_Response = await Response.json();
      console.log(json_Response);
      cart_products = json_Response.message;
      cart_item_number.innerHTML = cart_products.length;
      referesh_cart_details();
    })
    .catch(error => {
      alert("Fatal error occured while fetching cart");

      //console.log("Error:", error);
    });
}

function referesh_cart_details() {
  if (cart_products.length == 0) {
    alert("Refresh Cart");
    let cookies = document.cookie.split(";");
    console.log(cookies[0]);

    const token = String(cookies).split("=")[1];
    console.log(token);
    if (typeof token == "undefined") {
      return verification_container.classList.replace(
        "dismiss",
        "verification_container"
      );
    }
  }
  cart_container.classList.replace("dismiss", "cart_list_container");
  loading_container.classList.replace("dismiss", "loading_container");
  let cookies = document.cookie.split(";");
  console.log(cookies[0]);

  const token = String(cookies).split("=")[1];
  console.log(token);
  if (token.length == 0) return (document.cookie = "");

  // cart_products;

  let placeholder = document.getElementById("list_container");
  placeholder.innerHTML = "";
  const total_products = document.getElementById("total_products");
  let total_sum = 0;
  for (let i = 0; i < cart_products.length; i++) {
    let div = document.createElement("div");
    div.classList.add("row_container");
    total_sum += cart_products[i].subtotal;
    div.innerHTML = `
      <div class="column">
          <div class="row_"><span class="Product_id">Product Id</span> <span class="Product_id">${cart_products[
            i
          ].productId}</span>
          </div>
          <div class="row_"><span class="Product_price">ZMW ${cart_products[i]
            .price}</span> <span class="Product_price"> x </span><span
              class="Product_price">${cart_products[i].quantity}</span></div>
          <div class="row_"><span class="Product_id">Sizes wanted </span> <span class="Product_id">${cart_products[
            i
          ].productSpecifications}</span></div>
        </div>
        <div class="subtotal">
  
          <span id="subtotal">ZMW ${cart_products[i].subtotal}</span>
          <span class="remove_from_cart" id= "${cart_products[i]
            ._id}">Remove</span>
        </div>
  
     `;

    placeholder.insertAdjacentElement("beforeend", div);
  }

  total_products.innerHTML = `ZMW ${total_sum}`;
  //close loading screen
  loading_container.classList.replace("loading_container", "dismiss");
  verification_container.classList.replace("verification_container", "dismiss");
}
