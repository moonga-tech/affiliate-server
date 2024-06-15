//TRANSACTION TYPE (REQUEST OF SENDING)
let paymentType = "";
let phoneNumber = "";
//ALL SELECTORS//

//profile
profile_menu = document.getElementById("profile_menu");

transact_menu = document.getElementById("transact_menu");

home_menu = document.getElementById("home_menu");

//copy button
const copy_button = document.getElementById("copy_button");
//old password input
const Old_password = document.getElementById("Old_password");

//new password input
const new_password = document.getElementById("new_password");
//reset password
const reset_password = document.getElementById("reset_password");
//generated link
const generated_link = document.getElementById("generated_link");

//generate link
const generate_link = document.getElementById("generate_link");
//home container
const home_container = document.getElementById("home_container");
//transaction container
const transaction_container = document.getElementById("transaction_container");
//profile container
const profile_container = document.getElementById("profile_container");
//login button
const logInButton = document.getElementById("login-button");

//locked loding icon
const lockedloadingIcon = document.getElementById("loading-icon-locked");

//unlocked loding icon
const unlockedloadingIcon = document.getElementById("loading-icon-unlocked");

//unlocked loding icon
const signuploadingIcon = document.getElementById("loading-icon-signup");

//signup button
const signupButton = document.getElementById("signup-button");

//transact menu button
const transactButton = document.getElementById("transact-menu");

//payment option container
const paymentoptionsContainer = document.querySelector(
  ".payment-options-container-after"
);

//sign up notification container
const signupnotificationContainer = document.querySelector(
  ".sign-up-notification"
);

const loginContent = document.querySelector(".login-content");

const signupContent = document.querySelector(".signup-content");

const signupLink = document.getElementById("signup-link");

const signinHolder = document.getElementById("signin-content-holder");

const signupHolder = document.getElementById("signup-content-holder");

const cancelButton = document.getElementById("cancel");

const loginContainer = document.querySelector(".login-container");

const onloadContainer = document.querySelector(".onload");

const buttomTitle = document.getElementById("account");

//FUNCTIONS

signupLink.addEventListener("click", function() {
  console.log(signupLink.innerHTML);

  if (signupLink.innerHTML == "Signup") {
    buttomTitle.innerText = "Have an account?";
    signupLink.innerText = "Sign in";

    signinHolder.classList.replace("login-content", "dismiss");
    signupHolder.classList.replace("dismiss", "signup-content");
  } else {
    buttomTitle.innerText = "Don't have an account?";
    signupLink.innerText = "Signup";

    signinHolder.classList.replace("dismiss", "login-content");
    signupHolder.classList.replace("signup-content", "dismiss");
  }
});

//SIGNUP
signupButton.addEventListener("click", function() {
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const phoneNumber = document.getElementById("signup-input-phone-number")
    .value;
  const email = document.getElementById("signup-input-email").value;
  const password = document.getElementById("signup-input-password").value;
  

  if (
    firstName == "" ||
    lastName == "" ||
    email == "" ||
    phoneNumber == "" ||
    password == ""
  )
    return alert("Fill in all details");

  signuploadingIcon.style.display = "block";

  //const url = `http://localhost:600/api/v1/register`;

  const url = "https://lydiahouse.onrender.com/api/v1/register";
  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      password: password
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(Response => Response.json())
    .then(data => {
      console.log(data.message);

      if (data.message == "phone number already exists") {
        alert("Phone number already registred");
        console.log("mmm");
        signuploadingIcon.style.display = "none";
   
        //phone number exist
        signupnotificationContainer.style.visibility = "visible";
        signupnotificationContainer.style.backgroundColor = "red";
        signupnotificationContainer.innerText = "Phone # already registered";

        //dismiss notification
        setTimeout(function() {
          signupnotificationContainer.style.visibility = "hidden";
        }, 3000);
      } else {
        signuploadingIcon.style.display = "none";
        //successfully sign up
        signupnotificationContainer.style.backgroundColor = "#0022B0";
        signupnotificationContainer.innerText = "Successfully signed up";
        signupnotificationContainer.style.visibility = "visible";

        //dismiss notification
        setTimeout(function() {
          signupnotificationContainer.style.visibility = "hidden";
        }, 2000);

        console.log("sucessfully registered");
      }
    })
    .catch(error => {
      signuploadingIcon.style.display = "none";
      alert("Fatal error occured while signing up");
      console.log("Error:", error);
    });
});

//LOGIN
logInButton.addEventListener("click", function() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 3000);
  const password = document.getElementById("password-login").value;
  const phoneNumber = document.getElementById("phone-number-login").value;
  console.log(phoneNumber);
  console.log(password);

  if (phoneNumber == "" || password == "")
    return alert("Phone Number cannot be empty or password");

  lockedloadingIcon.style.display = "block";
  unlockedloadingIcon.style.display = "none";
  //const url = `http://localhost:600/api/v1/login`;
 const url = `https://lydiahouse.onrender.com/api/v1/login`;
  const encoded = encodeURI(url);

  //LOGIN REQUEST SENT
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
    .then(Response => Response.json())
    .then(data => {
      console.log(data);

      if (data.message == "user doesn't exists") {
        lockedloadingIcon.style.visibility = "none";
        unlockedloadingIcon.style.visibility = "none";
        //USER DOES EXIST
        signupnotificationContainer.style.backgroundColor = "red";
        signupnotificationContainer.innerText = "Phone # not registered";
        signupnotificationContainer.style.visibility = "visible";
        //dismiss notification
        setTimeout(function() {
          signupnotificationContainer.style.visibility = "hidden";
        }, 2000);
      } else if (data.message == "invalid password") {
        lockedloadingIcon.style.visibility = "visible";
        unlockedloadingIcon.style.visibility = "none";

        console.log(data.message);

        //WRONG PASSWORD
        signupnotificationContainer.style.backgroundColor = "red";
        signupnotificationContainer.innerText = "WRONG PASSWORD";
        signupnotificationContainer.style.visibility = "visible";
        //dismiss notification
        setTimeout(function() {
          signupnotificationContainer.style.visibility = "hidden";
        }, 2000);
      } else {
        lockedloadingIcon.style.visibility = "none";
        unlockedloadingIcon.style.visibility = "visible";

        setTimeout(function() {
          //CORRECT PASSWORD
          loginContainer.classList.replace("login-container", "dismiss");

          const amount_digit = document.getElementById("amount_digit");
          const client_details = document.getElementById("name");
          const generated_link = document.getElementById("generated_link");

          const click_number = document.getElementById("click_number_");
          let cookies = document.cookie.split(";");
          //console.log(cookies[0]);
          const token = String(cookies).split("=")[1];
          //console.log(token);
       

          if (typeof token != "undefined") {

            const client_details_ = parseJwt(token);
       
            console.log(click_number);
            amount_digit.innerHTML = `ZMW ${client_details_.balance}`;
            client_details.innerHTML =
              client_details_.firstName + " " + client_details_.lastName;
            generated_link.innerHTML = data.user.link;
            click_number.innerHTML = `${client_details_.linkViews} clicks`
          }
        }, 1700);
      }
    })
    .catch(error => {
      lockedloadingIcon.style.display = "none";
      unlockedloadingIcon.style.display = "none";
      loginContainer.classList.replace("dismiss", "login-container");
      alert("Fatal error occured while logging in");
      console.error("Error:", error);
    });
});

////////////////////////////functions/////////////////////

function myFunction() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 3000);
}
generate_link.addEventListener("click", function() {
  const client_details = document.getElementById("name");

  let cookies = document.cookie.split(";");
  //console.log(cookies[0]);

  const token = String(cookies).split("=")[1];
  //console.log(token);
  if (typeof token != "undefined") {
    const client_details_ = parseJwt(token);

    client_details.innerHTML =
      client_details_.firstName + " " + client_details_.lastName;

    console.log("link clicked");
    const url = `http://localhost:600/api/v1/register/link`;
    //const url = `https://lydiahouse.onrender.com/api/v1/login`;
    const encoded = encodeURI(url);

    //LOGIN REQUEST SENT
    fetch(encoded, {
      method: "POST",
      body: JSON.stringify({
        phoneNumber: client_details_.phoneNumber
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(async Response => {
        const serverResponse = await Response.json();
        console.log(serverResponse);
        generated_link.innerHTML = serverResponse.link.link;
      })
      .catch(error => {
        alert("error occured generating link");
        console.error("Error:", error);
      });
  }
});

copy_button.addEventListener("click", function() {
  let cookies = document.cookie.split(";");
  //console.log(cookies[0]);

  const token = String(cookies).split("=")[1];
  //console.log(token);
  if (typeof token != "undefined") {
    const client_details_ = parseJwt(token);
    // Copy the text inside the text field
    navigator.clipboard.writeText(client_details_.link);
    console.log(client_details_.link);
  }

  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 3000);
});

profile_menu.addEventListener("click", function() {
  console.log("profile");
  show_profile_container();
  hide_home_container();
  hide_transaction_container();
});

transact_menu.addEventListener("click", function() {
  console.log("transact");

  show_transaction_container();
  hide_home_container();
  hide_profile_container();
});

home_menu.addEventListener("click", function() {
  console.log("home");
  show_home_container();
  hide_profile_container();
  hide_transaction_container();
});

//hide home container
function hide_home_container() {
  home_container.classList.replace("home_container", "dismiss");
}

//show home container
function show_home_container() {
  home_container.classList.replace("dismiss", "home_container");
}

//hide home container
function hide_transaction_container() {
  transaction_container.classList.replace("transaction_container", "dismiss");
}

//show transaction container
function show_transaction_container() {
  transaction_container.classList.replace("dismiss", "transaction_container");
}

//hide profile container
function hide_profile_container() {
  profile_container.classList.replace("profile_container", "dismiss");
}
//show profile container
function show_profile_container() {
  profile_container.classList.replace("dismiss", "profile_container");
}

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
