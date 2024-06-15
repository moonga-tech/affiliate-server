//DEFAULTS
let uuidglobal;
let momostatus;
let momocountDown;
let provider;

//MODAL BUTTON(okay -FAILED TRANSACTION)
const okayfailedButton = document.getElementById("okay-failed");

//FAILED TRANSACTION MODAL CONTAINER
const failedtransactionmodalContainer = document.getElementById(
  "failed-transaction-modal-container"
);

//LOADING CONTAINER
const loadingContainer = document.getElementById("loading-container");

//TRANSACTION BUTTON(initiate transaction)
const transactionButton = document.getElementById("initiate");

//PAY BUTTON( show modal)
const payButton = document.getElementById("pay-button");

//CANCEL BUTTON(hide modal)
const cancelButton = document.getElementById("cancel");

//TRANSACTION CONTAINER
const transactionContainer = document.getElementById("transaction-container");

//PHONE NUMBER INPUT
const paymentInput = document.getElementById("verify-input");

function initiateTransaction() {
  console.log(paymentInput.value);
  var number = `${paymentInput.value}`;
  const phoneNumber = number.split("");
  if (paymentInput.value == "") return alert("phone number missing");

  if (phoneNumber.length < 10) return alert("phone number not complete");

  if (phoneNumber[2] == 7) {
    provider = 2;
  } else if (phoneNumber[2] == 6) {
    provider = 3;
  } else if (phoneNumber[2] == 5) {
    provider = 4;
  }

  console.log(provider, " PROVIDER");

  loadingContainer.classList.replace(
    "loading-container-after",
    "loading-container"
  );

  let count = 0;
  let momocountdownNumber = 100;

  momocountDown = setInterval(() => {
    if (momocountdownNumber == 0) {
      clearInterval(momostatus);
      clearInterval(momocountDown);
      loadingContainer.classList.replace(
        "loading-container",
        "loading-container-after"
      );
      failedtransactionmodalContainer.classList.replace(
        "failed-transaction-modal-container-after",
        "failed-transaction-modal-container"
      );
      return;
    }

    document.getElementById(
      "time_out_coutnt"
    ).innerText = --momocountdownNumber;
  }, 1000);

  const url = `https://www.zatuwallet.com/api/v1/invoicepayment`;
  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      receiver: document.getElementById("To").innerText,
      sender: document.getElementById("From").innerText,
      totalAmount: document.getElementById("Total").innerText,
      orderId: document.getElementById("InvoiceiD").innerText,
      provider: provider,
      payer: paymentInput.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(Response => Response.json())
    .then(Data => {
      console.log(Data, "TRANSACTION RESPONSE");

      uuidglobal = Data.txnId;

      //MOMO STATUS
      setTimeout(() => {
        momostatus = setInterval(() => {
          if (momocountdownNumber == 0) {
            clearInterval(momostatus);
            clearInterval(momocountDown);
            loadingContainer.classList.replace(
              "loading-container",
              "loading-container-after"
            );
            failedtransactionmodalContainer.classList.replace(
              "failed-transaction-modal-container-after",
              "failed-transaction-modal-container"
            );
            return;
          }

          //FETCH TRANSACTION STATUS`
          const urlUuuid = `https://www.zatuwallet.com/api/v1/transactionstatus/${uuidglobal}`;

          fetch(urlUuuid)
            .then(Response => Response.json())
            .then(data => {
              console.log(data);

              if (data.message.status == "SUCCESSFUL") {
                clearInterval(momostatus);
                clearInterval(momocountDown);

                loadingContainer.classList.replace(
                  "loading-container",
                  "loading-container-after"
                );
                modalContainer.classList.replace(
                  "modal-container-after",
                  "modal-container"
                );
              } else if (data.message.status == "FAILED") {
                clearInterval(momostatus);
                clearInterval(momocountDown);
                loadingContainer.classList.replace(
                  "loading-container",
                  "loading-container-after"
                );
                failedtransactionmodalContainer.classList.replace(
                  "failed-transaction-modal-container-after",
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
    })
    .catch(error => {
      alert("Fatal error occured while sending OTP");

      console.error("Error:", error);
    });
}

//INITIATE TRANSACTION
transactionButton.addEventListener("click", initiateTransaction);

//SHOW TRANSACTION MODAL
payButton.addEventListener("click", function() {
  transactionContainer.classList.replace(
    "transaction-container-after",
    "transaction-container"
  );
  transactionContainer.style.visibility = "visible";
});

//CANCEL TRANSACTION
cancelButton.addEventListener("click", function() {
  transactionContainer.classList.replace(
    "transaction-container",
    "transaction-container-after"
  );
});

//FAILED TRANSACTION
okayfailedButton.addEventListener("click", function() {
  loadingContainer.classList.replace(
    "loading-container",
    "loading-container-after"
  );
  failedtransactionmodalContainer.classList.replace(
    "failed-transaction-modal-container",
    "failed-transaction-modal-container-after"
  );
});

//ON LOAD
window.onload = function() {
  const urlDetails = window.location.search;

  const urlParams = new URLSearchParams(urlDetails);

  const invoiceId = urlParams.get("invoiceId");

  uuidglobal = invoiceId;

  const urlUuuid = `https://zatuwallet.onrender.com/invoicelist?invoiceId=${invoiceId}`;

  console.log(urlUuuid);

  fetch(urlUuuid)
    .then(response => {
      //console.log(response)
      return response.json();
    })
    .then(products => {
      let sum = 0;
      console.log(products);
      let placeholder = document.querySelector("#data-output");
      var invoiceItems = products.message.invoiceItems;
      document.getElementById("status").innerHTML =
        products.message.invoiceStatus;

      document.getElementById("From").innerHTML = products.message.from;
      document.getElementById("To").innerHTML = products.message.to;
      document.getElementById("InvoiceiD").innerHTML =
        products.message.invoiceId;

      let out = "";
      for (let product of invoiceItems) {
        sum += product.total;
        out += `
         <tr>
           
            <td>${product.productName}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>${product.total}</td>
         </tr>
      `;
      }
      document.getElementById("Total").innerHTML = sum;
      placeholder.innerHTML = out;
    });
};
