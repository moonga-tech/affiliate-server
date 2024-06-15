let user_list = [];

let current_user = "";
//const suspend_account_BUTTON = document.getElementById("suspend_account_button");
const sidebar_container = document.getElementById("sidebar_container");
const user_list_container = document.getElementById("user_list_container");
const user_dialog = document.getElementById("user_dialog");
//const user_list_container = document.getElementById("user_dialog");
const options_transactions = document.getElementById("options_transactions");
const options_users = document.getElementById("options_users");
const options_settings = document.getElementById("options_settings");
const search_transaction_icon_id = document.getElementById(
  "search_transaction_icon_id"
);
const row_3 = document.getElementById("row_3");
const transaction_list_container = document.getElementById(
  "transaction_list_container"
);
const loading_container = document.getElementById("loading_container");
const transaction_input_id = document.getElementById("transaction_input_id");
const register_user_button = document.getElementById("register_user_button");
const successful_transaction = document.getElementById(
  "successful_transaction"
);

const pending_transaction = document.getElementById("pening_transaction");
const failed_transaction = document.getElementById("failed_transaction");
const user_input_details_container = document.getElementById(
  "user_input_details_container"
);
const phone_number_input = document.getElementById("phone_number_input");
const verification_container = document.getElementById(
  "verification_container"
);

const successful_verification = document.getElementById(
  "successful_verification"
);

const verification_content_holder = document.getElementById(
  "verification_content_holder"
);
const UUIDGenerator = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] &
        (15 >> (c / 4)))).toString(16)
  );
const uuid = UUIDGenerator();

sidebar_container.addEventListener("click", function(e) {
  //console.log(e.target.id);

  if (e.target.id == "options_transactions") {
    console.log(e.target.id);
    fetch_transaction("SUCCESSFUL");
    show_transaction_list();
    hide_user_list();
  } else if (e.target.id == "options_users") {
    search_user("all");
    //hide_transaction_list()
    //show_user_list()
  } else if (e.target.id == "options_settings") {
    console.log(e.target.id);
  }
});
//user list container----
user_list_container.addEventListener("click", function(e) {
  console.log(e.target);

  const found = user_list.find(user => user._id == e.target.id);

  if (found.accountStatus == "SUSPENDED") {
    const status_column = document.getElementById("status_columns");

    status_column.classList.replace(
      "status_columns",
      "status_columns_suspended"
    );
  } else {
    const status_column = document.getElementById("status_columns");

    status_column.classList.replace(
      "status_columns_suspended",
      "status_columns"
    );
  }

  console.log(found);
  document.getElementById("credit_score").innerHTML = found.creditScore;
  document.getElementById("credit_limit").innerHTML = found.creditLimit;
  document.getElementById("account_status").innerHTML = found.accountStatus;
  document.getElementById("dialog_user_full_names").innerHTML =
    found.firstName + " " + found.lastName;
  document.getElementById("dialog_user_phone_number").innerHTML =
    found.phoneNumber;
  document.getElementById("current_account").innerHTML = found.balance;
  document.getElementById("dialog_user_pool_account").innerHTML =
    "ZMW " + found.pool;
  document.getElementById("dialog_user_holding_account").innerHTML =
    "ZMW " + found.holdingAccount;
  //show dialog
  user_dialog.classList.replace("dismiss", "user_dialog");

  current_user = found._id;
});

//USER DIALOG
user_dialog.addEventListener("click", function(e) {
  console.log(e.target.id);

  //HIDE DIALOG
  if (e.target.id == "user_dialog") {
    //hide dialog
    user_dialog.classList.replace("user_dialog", "dismiss");
  }
  if (e.target.id == "suspend_account_button") {
    console.log("CZZZZZZZZZZZZZZZZZZZZZ");
    show_loading();
    //const url = `http://localhost:600/api/v1/admin/users/suspend`;
    const url = `https://zatuwallet.onrender.com/api/v1/admin/users/suspend`;
    const encoded = encodeURI(url);
    fetch(encoded, {
      method: "POST",
      body: JSON.stringify({
        userId: current_user
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(async Response => {
        const response = await Response.json();
        console.log(response);
        if (Response.status == 200) {
          hide_loading();
          console.log("xxxxxxxxxxxxxxxxxxxx", response.account._id);

          changed_account_status(response.account._id);
        } else if (Response.status == 400) {
          hide_loading();
        }
      })
      .catch(error => {
        hide_loading();
        console.log(error);
      });
  }
});

//SHOW TRANSACTION LIST
function show_transaction_list() {
  transaction_list_container.classList.replace(
    "dismiss",
    "transaction_list_container"
  );
}

//HIDE TRANSACTION LIST
function hide_transaction_list() {
  transaction_list_container.classList.replace(
    "transaction_list_container",
    "dismiss"
  );
}

//SHOW LOADING
function show_loading() {
  loading_container.classList.replace("dismiss", "loading");
}

//HIDE LOADING
function hide_loading() {
  loading_container.classList.replace("loading", "dismiss");
}

//SHOW EMPTY LIST
function show_empty_list() {
  row_3.classList.replace("dismiss", "row_3");
}

//HIDE EMPTY LIST
function hide_empty_list() {
  row_3.classList.replace("row_3", "dismiss");
}

//PULL TRANSACTIONS-FUNCTION
function fetch_transaction(transactionType, transaction_id) {
  show_loading();
  console.log("MASTER");

 // const url = `http://localhost:600/api/v1/admin/transactions`;
  const url = `https://zatuwallet.onrender.com/api/v1/admin/transactions`;
  const encoded = encodeURI(url);
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      transactionId: transaction_id,
      transactionType: transactionType
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      const response = await Response.json();

      if (Response.status == 200) {
        hide_loading();
        hide_empty_list();
        console.log(response);
        const transaction_list_container_class = document.querySelector(
          ".subtitle_status"
        );
        let transaction_list_container = document.getElementById(
          "transaction_list_container"
        );
        var transaction_list = response.message;
        if (transaction_list == []) {
          hide_loading();
          show_empty_list();
        } else {
          let out = "";
          for (let transaction of transaction_list) {
            out += `
          <div class="transaction_container" id="transaction_container">
          <div class="transaction_row">
            <span class="transaction_text_title">Transaction ID: </span><span class="subtitle" id="transaction_id${transaction._id}"> ${transaction.txnId}</span>

          </div>
          <div class="transaction_row">
            <span class="transaction_text_title">Sender : </span><span class="subtitle" id="sender${transaction._id}"> ${transaction.sender}</span>

          </div>
          <div class="transaction_row">
            <span class="transaction_text_title">Receiver : </span><span class="subtitle" id="Receiver${transaction._id}"> ${transaction.receiver} </span>

          </div>
          <div class="transaction_row">
            <span class="transaction_text_title">Amount: </span><span class="subtitle" id="amount${transaction._id}"> ZMW ${transaction.amount}</span>

          </div>

          <div class="transaction_row">
            <span class="transaction_text_title_date">Date: </span><span class="subtitle_date" id="date${transaction._id}"> ${transaction.date}</span>

          </div>
          <div class="transaction_row">
          <span class="transaction_text_title_status">Status: </span><span class="subtitle_status_${transactionType}" id="date">
           ${transactionType}</span>

        </div>
        </div>
  `;
          }

          transaction_list_container.innerHTML = out;
          hide_user_list();
          hide_loading();
          hide_empty_list();
          show_transaction_list();
          transaction_list_container_class.style.backgroundColor = "red";
          transaction_list_container_class.style.paddingLeft = "20";
          transaction_list_container_class.style.paddingRight = "20";
          transaction_list_container_class.style.paddingTop = "2";
          transaction_list_container_class.style.paddingBottom = "2";
          transaction_list_container_class.style.borderRadius = "20";
          transaction_list_container_class.style.color = "#f2f2f2e8";
          console.log(transaction_list_container_class.style);
        }
      } else if (Response.status == 400) {
        hide_loading();
        hide_transaction_list();
      }
    })
    .catch(error => {
      hide_loading();
      console.log(error);
    });
}

//SHOW USERS
function show_user_list() {
  user_list_container.classList.replace("dismiss", "user_list_container");
}

//HIDE USERS
function hide_user_list() {
  user_list_container.classList.replace("user_list_container", "dismiss");
}

//SHOW LOGIN AUTH
function show_login_auth() {
  user_input_details_container.classList.replace(
    "dismiss",
    "user_input_details_container"
  );
}

//SHOW LOGIN AUTH
function hide_login_auth() {
  user_input_details_container.classList.replace(
    "user_input_details_container",
    "dismiss"
  );
}
//SEARCH TRANSACTION
search_transaction_icon_id.addEventListener("click", function() {
  fetch_transaction("SUCCESSFUL", transaction_input_id.value);
});

//PULL SUCCESSFUL TRANSACTIONS-FUNCTION
successful_transaction.addEventListener("click", function() {
  fetch_transaction("SUCCESSFUL");
  successful_transaction.classList.replace(
    "transaction_type_content_holder_inactive",
    "transaction_type_content_holder_active"
  );
  pending_transaction.classList.replace(
    "transaction_type_content_holder_active",
    "transaction_type_content_holder_inactive"
  );
  failed_transaction.classList.replace(
    "transaction_type_content_holder_active",
    "transaction_type_content_holder_inactive"
  );
});

//PULL PENDING TRANSACTIONS-FUNCTION
pending_transaction.addEventListener("click", function() {
  fetch_transaction("PENDING");

  pending_transaction.classList.replace(
    "transaction_type_content_holder_inactive",
    "transaction_type_content_holder_active"
  );
  failed_transaction.classList.replace(
    "transaction_type_content_holder_active",
    "transaction_type_content_holder_inactive"
  );
  successful_transaction.classList.replace(
    "transaction_type_content_holder_active",
    "transaction_type_content_holder_inactive"
  );
});

//PULL FAILED TRANSACTIONS-FUNCTION
failed_transaction.addEventListener("click", function() {
  fetch_transaction("FAILED");

  failed_transaction.classList.replace(
    "transaction_type_content_holder_inactive",
    "transaction_type_content_holder_active"
  );
  successful_transaction.classList.replace(
    "transaction_type_content_holder_active",
    "transaction_type_content_holder_inactive"
  );
  pending_transaction.classList.replace(
    "transaction_type_content_holder_active",
    "transaction_type_content_holder_inactive"
  );
});
//LOGIN ADMIN
register_user_button.addEventListener("click", async function() {
  const phoneNumber = phone_number_input.value;
  //const url = `http://localhost:600/api/v1/admin/login`;
  const url = `https://zatuwallet.onrender.com/api/v1/admin/login`;
  const encoded = encodeURI(url);
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      phoneNumber: phoneNumber,

      uuid: uuid
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      const response = await Response.json();

      if (Response.status == 200) {
        user_input_details_container.classList.replace(
          "user_input_details_container",
          "dismiss"
        );
        verification_container.classList.replace(
          "dismiss",
          "verification_container"
        );
      }
      console.log(Response);
      console.log(response);

      const url = `http://localhost:600/api/v1/admins/transactions`;
      //const url = `https://zatuwallet.onrender.com/api/v1/transactionlist`;
      const encoded = encodeURI(url);
      fetch(encoded, {
        method: "POST",
        body: JSON.stringify({
          transactionType: "successful"
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(async Response => {
          const response = await Response.json();

          if (Response.status == 200) {
            console.log(response);
            let placeholder = document.querySelector("#data-output");
            var transaction_list = response.message.transaction_list;
            document.getElementById("status").innerHTML =
              products.message.invoiceStatus;

            let out = "";
            for (let transaction of transaction_list) {
              sum += product.total;
              out += `
     
      `;
            }

            placeholder.innerHTML = out;
          } else if (Response.status == 400) {
          }
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
});

//ON LOAD
window.onload = async function() {
 // https://zatuwallet.onrender.com
// http://localhost:600
  const eventSource = new EventSource(`https://zatuwallet.onrender.com/stream?id=${uuid}`);
  eventSource.addEventListener("authenticated", function(e) {
    console.log("ZATU ADMIN", e);

    verification_content_holder.classList.replace(
      "verification_content_holder",
      "dismiss"
    );
    successful_verification.classList.replace(
      "dismiss",
      "successful_verification"
    );

    setTimeout(function() {
      hide_login_auth();
      verification_container.classList.replace(
        "verification_container",
        "dismiss"
      );

      verification_content_holder.classList.replace(
        "dismiss",
        "verification_content_holder"
      );
      successful_verification.classList.replace(
        "successful_verification",
        "dismiss"
      );
      fetch_transaction("SUCCESSFUL");

    }, 1500);
    


  });
  eventSource.addEventListener("connection", function(e) {
    console.log("ZATU ADMIN", e);
  });


  // eventSource.onmessage = function(event) {
  //   console.log(event);

  //   if (event.data == "successful") {
  //     console.log(event.data);
  //   } else if (event.data == "failed") {
  //     console.log(event.data);
  //   }
  // };
  // eventSource.onerror = function(event) {
  //   console.log(event.error);
  // };
};


//fetch users
function search_user(user) {
  show_loading();
  //const url = `http://localhost:600/api/v1/admin/users`;
  const url = `https://zatuwallet.onrender.com/api/v1/admin/users`;
  const encoded = encodeURI(url);
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      userId: user
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      const response = await Response.json();

      if (Response.status == 200) {
        hide_loading();
        hide_empty_list();
        console.log(response);
        const transaction_list_container_class = document.querySelector(
          ".subtitle_status"
        );
        let user_list_container = document.getElementById(
          "user_list_container"
        );
        //  var transaction_list = response.message;
        user_list = response.message;
        if (user_list == []) {
          hide_loading();
        } else {
          let out = "";
          for (let user of user_list) {
            let account_status_class_check = "dismiss";
            let account_status_class_flagged = "dismiss";
            if (user.accountStatus == "SUSPENDED") {
              account_status_class_flagged = "icon_user_section";
              account_status_class_check = "dismiss";
            } else if (user.accountStatus == "DOMANT") {
              account_status_class_flagged = "dismiss";
              account_status_class_check = "icon_user_section";
            }

            out += `
            <div class="row_user_detains_content_holder" id="${user._id}">
            <div class="column_user">
              <div class="row_user"><span>Full Names: </span><span class="full_names_user"> ${user.firstName} ${user.lastName}</span></div>
  
              <div class="row_user"><span>Phone #</span><span class="user_phone_number">${user.phoneNumber}</span></div>
            </div>
  
            <div class="${account_status_class_check}" id="icon_user_section_check">

            <img src="./images/check.png" alt="" width="20">


          </div>
          <div class="${account_status_class_flagged}" id="icon_user_section_flagged">

            <img src="./images/images.png" alt="" width="20">


          </div>
          </div>
            `;
          }

          user_list_container.innerHTML = out;
          hide_transaction_list();
          hide_loading();
          show_user_list();
        }
      } else if (Response.status == 400) {
        hide_loading();
        hide_transaction_list();
      }
    })
    .catch(error => {
      hide_loading();
      console.log(error);
    });
}

async function changed_account_status(user_, user_list_) {
  // user_list = user_list_;
  search_user("all");

  const status_column = document.getElementById("status_columns");

  status_column.classList.replace("status_columns", "status_columns_suspended");
  //search_user(user_);
  const found = user_list.find(user => user._id == user_);

  console.log(found);
  document.getElementById("credit_score").innerHTML = found.creditScore;
  document.getElementById("credit_limit").innerHTML = found.creditLimit;
  document.getElementById("account_status").innerHTML = found.accountStatus;
  document.getElementById("dialog_user_full_names").innerHTML =
    found.firstName + " " + found.lastName;
  document.getElementById("dialog_user_phone_number").innerHTML =
    found.phoneNumber;
  document.getElementById("current_account").innerHTML = found.balance;
  document.getElementById("dialog_user_pool_account").innerHTML =
    "ZMW " + found.pool;
  document.getElementById("dialog_user_holding_account").innerHTML =
    "ZMW " + found.holdingAccount;

  //show dialog
  user_dialog.classList.replace("dismiss", "user_dialog");

  current_user = found._id;
}
