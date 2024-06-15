let uuidglobal;
let momostatus;
let momocountDown;

//MODAL BUTTON(okay -SUCCESSFUL TRANSACTION)
const okaysuccessfulButton = document.getElementById("okay-successful");

//TIMEOUT COUNT)
//const countdown = document.getElementById('time_out_coutnt');

//MODAL BUTTON(okay -FAILED TRANSACTION)
const okayfailedButton = document.getElementById("okay-failed");

//WRONG OTP NOTIFICATION CONTAINER
const wrongotpnotificationContainer = document.getElementById(
  "wrong-otp-notification-container"
);

const verifyButton = document.querySelector("#verify");

const imput = document.getElementById("verify-input");

//LANDING SCREEN CONTAINER
const landingscreenContainer = document.getElementById(
  "landing-screen-container"
);

//PROCEED BUTTON
const proceedButton = document.getElementById("proceed-button");

//GENERATE URL BUTTON
const generateurlButton = document.getElementById("generate");

//LOADING CONTAINER
const loadingContainer = document.getElementById("loading-container");

//MODAL CONTAINER
const modalContainer = document.getElementById("modal-container");

//FAILED TRANSACTION MODAL CONTAINER
const failedtransactionmodalContainer = document.getElementById("failed-transaction-modal-container");

const modal = document.querySelector(".modal");

const modal_content = document.querySelector(".modal-content");

const initiate = document.querySelector("#initiate");

const sms_notification = document.getElementById("notification");

const checkout = document.getElementById("check");

const circle = document.getElementById("circle");

const url = document.getElementById("url");
const sendernumberUrl = document.getElementById("sender-url");
const receivernumberUrl = document.getElementById("receiver-url");
const amountUrl = document.getElementById("amount-url");
const generateUrl = document.getElementById("generate-url");
const cancelUrl = document.getElementById("cancel-url");
const urlContainer = document.querySelector(".url-container");
const urlgenerateContainer = document.getElementById("generate-url-container");
const generate = document.getElementById("generate");

//FUNCTIONS

//Check transaction status
function checkStatus() {
  //FETCH UUID
  const urlUuuid = "https://www.zatuwallet.com/api/v1/uuid";

  fetch(urlUuuid)
    .then(Response => Response.json())
    .then(data => {
      return data.uuid;
    })
    .then(uuidSetup)
    .catch(error => {
      //alert("Fatal error occured")
      console.error("Error:", error);
    });
}

function closelandingContainer() {
  landingscreenContainer.classList.replace(
    "landing-screen-container",
    "landing-screen-container-after"
  );
}

proceedButton.addEventListener("click", closelandingContainer);

generateUrl.addEventListener("click", function() {
  console.log(sendernumberUrl.value);
  const zatuUrl = `https://www.zatuwallet.com/checkout.html?sid=${sendernumberUrl.value}&rid=${receivernumberUrl.value}&tam=${amountUrl.value}`;

  urlContainer.style.display = "block";
  url.innerText = zatuUrl;
});

cancelUrl.addEventListener("click", function() {
  urlgenerateContainer.classList.replace(
    "generate-transaction-container",
    "generate-transaction-container-after"
  );
});

generate.addEventListener("click", function() {
  urlgenerateContainer.classList.replace(
    "generate-transaction-container-after",
    "generate-transaction-container"
  );
});

//FUNCTIONS

//HIDE MODALS( successful transaction has occurred)
okaysuccessfulButton.addEventListener("click", function() {
  loadingContainer.classList.replace(
    "loading-container",
    "loading-container-after"
  );
  modalContainer.classList.replace("modal-container", "modal-container-after");
});

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

//INITIATE MOMO TRANSACTION (send payment propmt)
initiate.addEventListener("click", function() {
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

  const otp = document.getElementById("verify-input").value;

  if (otp == "") return alert("OTP code is required");

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
          console.log(data.message);

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

  const url = `https://www.zatuwallet.com/api/v1/checkout/momo`;
  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      receiver: document.getElementById("receiver").innerText,
      sender: document.getElementById("sender").innerText,
      totalAmount: document.getElementById("total").innerText,
      orderId: document.getElementById("orderid").innerText,
      otp: otp
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(Response => Response.json())
    .then(data => {
      if (data.message === "OTP doesn't exist") {
        //WRONG OTP

        wrongotpnotificationContainer.classList.replace(
          "wrong-otp-notification-after",
          "wrong-otp-notification"
        );

        setTimeout(function() {
          wrongotpnotificationContainer.classList.replace(
            "wrong-otp-notification",
            "wrong-otp-notification-after"
          );
        }, 1000);

        return;
      } else {
        //CORRECT OTP
        loadingContainer.classList.replace(
          "loading-container-after",
          "loading-container"
        );
      }
    })
    .catch(error => {
      alert("Fatal error occured while transacting");
      console.error("Error:", error);
    });
});

//VERIFY TRANSACTION (send verification code to approval number)
verifyButton.addEventListener("click", function() {
  sms_notification.classList.replace(
    "verification-loading",
    "verification-loading-after"
  );

  imput.style.display = "block";
  verifyButton.style.display = "none";
  initiate.style.display = "block";
  generateurlButton.style.display = "none";

  //SMS SENDING
  const senderNumber = document.getElementById("sender").innerText;
  const url = `https://www.zatuwallet.com/api/v1/sms`;
  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      receiver: document.getElementById("receiver").innerText,
      sender: document.getElementById("sender").innerText,
      totalAmount: document.getElementById("total").innerText,
      orderId: document.getElementById("orderid").innerText
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(Response => Response.json())
    .then(Data => {
      console.log(Data);

      checkout.style.display = "block";
      circle.style.display = "none";

      setTimeout(function() {
        sms_notification.classList.replace(
          "verification-loading-after",
          "verification-loading"
        );

        checkout.style.display = "none";
        circle.style.display = "block";
      }, 1000);
    })
    .catch(error => {
      alert("Fatal error occured while sending OTP");
      sms_notification.classList.replace(
        "verification-loading-after",
        "verification-loading"
      );

      checkout.style.display = "none";
      circle.style.display = "block";
      console.error("Error:", error);
    });
});

//ON LOAD
window.onload = function() {
  const urlDetails = window.location.search;

  const urlParams = new URLSearchParams(urlDetails);

  const receiver = urlParams.get("rid");
  const sender = urlParams.get("sid");
  const totalAmount = urlParams.get("tam");
  const orderId = urlParams.get("orid");
  document.getElementById("receiver").innerHTML = receiver;
  document.getElementById("sender").innerHTML = sender;
  document.getElementById("total").innerHTML = totalAmount;
  document.getElementById("orderid").innerHTML = orderId;

  //FETCH UUID
  const urlUuuid = "https://www.zatuwallet.com/api/v1/uuid";

  fetch(urlUuuid)
    .then(Response => Response.json())
    .then(data => {
      return data.uuid;
    })
    .then(uuidSetup)
    .catch(error => {
      //alert("Fatal error occured")
      console.error("Error:", error);
    });

  if (sender !== null) {
    closelandingContainer();
  }

  function uuidSetup(uuid) {
    uuidglobal = uuid;
    document.getElementById("orderid").innerText = uuid;

    const eventSource = new EventSource(
      `https://www.zatuwallet.com/stream?id=${uuid}`
    );

    eventSource.onmessage = function(event) {
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
  }
};
