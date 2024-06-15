//ON LOAD
window.onload = function() {
  const urlDetails = window.location.search;

  const urlParams = new URLSearchParams(urlDetails);

  const invoiceId = urlParams.get("invoiceId");

  uuidglobal = invoiceId;

  const urlUuuid = `http://localhost:600/api/v1/shareholders`;

  console.log(urlUuuid);

  fetch(urlUuuid)
    .then(response => {
      //console.log(response)
      return response.json();
    })
    .then(shareholders => {
      let sum = 0;
      let Shareholders = [];
      console.log(shareholders);
      let placeholder = document.querySelector("#data-output");
      Shareholders = shareholders.message;
      // document.getElementById("status").innerHTML =
      //   shareholders.message.invoiceStatus;

      // document.getElementById("From").innerHTML = shareholders.message.from;
      // document.getElementById("To").innerHTML = shareholders.message.to;
      // document.getElementById("InvoiceiD").innerHTML =
      //   shareholders.message.invoiceId;
      const Shareholders_sorted = Shareholders.sort(function(a, b) {
        return b.shares - a.shares;
      });

      let out = "";
      for (let shareholder of Shareholders_sorted) {
        const percentage = shareholder.shares / 15000;
        const networth = shareholder.shares * 350;
        out += `
         <tr>
           
            <td>${shareholder.firstName} ${shareholder.lastName}</td>
            <td>${shareholder.shares}</td>
            <td>${percentage.toPrecision(2) * 100} %</td>
            <td>ZMW ${networth.toLocaleString()}</td>
            <td>ZMW ${shareholder.debttoShareholder}</td>
            <td>ZMW ${shareholder.debttoCompany}</td>
         </tr>
      `;
      }

      placeholder.innerHTML = out;
    });
};
