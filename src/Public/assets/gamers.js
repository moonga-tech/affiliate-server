let product_Image = "";

///////////////////////////////////////INPUTS/////////////////////

//Full Names
const full_names = document.getElementById("full_names");

//Age
const age = document.getElementById("age");

//Phone Number
const phoneNumber = document.getElementById("phoneNumber");



//////////////////////////////////////////END INPUTS//////////

//register
const register_Button = document.getElementById("open-account-button");

//loading container
const loadingContainer = document.getElementById("loading-container");

//register
const cancel_Button = document.getElementById("cancel");

//more_infor
const more_infor_Button = document.getElementById("more-infor-button");

//submit
const submit_Button = document.getElementById("submit");

//input container
const input_Container = document.getElementById("details_input_container");

//input container
const more_infor_Container = document.getElementById(
  "other-services-option-container"
);

/////////////////////////////////////CLICKS////////////////////////////////////////////////////////////

//show more information on qualifications
more_infor_Button.addEventListener("click", function() {
  show_infor();
  hide_inputs();
});

//cancel registration
cancel_Button.addEventListener("click", function() {
  hide_inputs();
});

//show input container
register_Button.addEventListener("click", function() {
  show_inputs();
  hide_infor();
});

//hide container when clicked
more_infor_Container.addEventListener("click", function() {
  hide_infor();
});

//submit details for the model
submit_Button.addEventListener("click", function() {
  show_loading();
  const url = `https://lydiahouse.onrender.com/api/v1/register/gamers`;
  //const url = `http://localhost:600/api/v1/register/gamers`;

  const encoded = encodeURI(url);

  //FETCH REQUEST SENT
  fetch(encoded, {
    method: "POST",
    body: JSON.stringify({
      fullNames: full_names.value,
      age: age.value,
      phoneNumber: phoneNumber.value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(async Response => {
      console.log(Response);
      const server_response = await Response.json();

      if (Response.status == 201) {
        alert("Successfully registered as a member");
        hide_loading();
        full_names.value = "";
        age.value = "";
        phoneNumber.value = "";
      } else {
        console.log(server_response);
        hide_loading();
        alert(server_response.message);
      }
    })
    .catch(error => {
      alert(
        "Error processing details. Kindly contact support team on 0976240701 for help"
      );
      hide_loading();
      console.error("Error:", error);
    });
});

//FUNCTIONS/////////////

//hide inputs
function hide_inputs() {
  input_Container.classList.replace("details_input_container", "dismiss");
}

//show inputs
function show_inputs() {
  input_Container.classList.replace("dismiss", "details_input_container");
}

//show infor
function show_infor() {
  more_infor_Container.classList.replace(
    "dismiss",
    "other-services-option-container"
  );
}

//hide infor
function hide_infor() {
  more_infor_Container.classList.replace(
    "other-services-option-container",
    "dismiss"
  );
}

//show loading
function show_loading() {
  loadingContainer.classList.replace("dismiss", "loading-container");
}

//hide loading
function hide_loading() {
  loadingContainer.classList.replace("loading-container", "dismiss");
}
