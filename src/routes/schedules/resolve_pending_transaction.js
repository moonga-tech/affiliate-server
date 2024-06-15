const axios = require("axios");
const PendingPayments = require("../../model/PendingPayment");
const FailedTransaction = require("../../model/FailedTransaction");
const SucessfulTransaction = require("../../model/SucessfulTransaction");
const User = require("../../model/User");
resolveTransaction = async function Resolvetransaction() {
  //GET TRANSACTION FROM PENDING TRANSACTIONS
  const pendingPayments = await PendingPayments.findOne();

  //CHECK IF PENDING PAYMENT IS EMPTY
  if (pendingPayments == null) {
    //console.log("PENDING TRANSACTION EMPTY");
    return;
  }

  //GET TRANSACTION FROM SUCCESSFULL TRANSACTIONS
  const transactionVerification_SUCESSFUL = SucessfulTransaction.find({
    txnId: pendingPayments.txnId
  });

  //GET TRANSACTION FROM FAILED TRANSACTIONS
  const transactionVerification_FAILED = FailedTransaction.find({
    txnId: pendingPayments.txnId
  });

  //CHECK IF SUCESSFUL TRANSACTION HAS ALREADY BEEN RESOLVED
  if (transactionVerification_SUCESSFUL.length > 0) {
    //DELETE PENDING PAYMENT
    await PendingPayments.findByIdAndDelete(pendingPayments._id);
    console.log("PENDING PAYMENT DELETED");
    return;
  }

  //CHECK IF FAILED TRANSACTION HAS ALREADY BEEN RESOLVED
  if (transactionVerification_FAILED.length > 0) {
    //DELETE PENDING PAYMENT
    await PendingPayments.findByIdAndDelete(pendingPayments._id);
    console.log("PENDING PAYMENT DELETED");
    return;
  }  else if (pendingPayments.provider === 1) {
    //AIRTEL PENDING PAYMENTS
    console.log("AIRTEL TRANSACTION FOUND");
  } else if (pendingPayments.provider == 2) {
    console.log(pendingPayments, "PENING TRANSACTION FOUND")
    //MOMO PENDING PAYMENTS
    //COLLECTION(check transaction status of collection transaction)
    if (pendingPayments.transactionType == "COLLECTION") {
      //CHECK TRANSACTION STATUS
      const referenceId = pendingPayments.txnId;

      //GENERATE TOKEN MOMO
      var session_url = "https://proxy.momoapi.mtn.com/collection/token/";

      var uname = process.env.MOMO_USER_NAME_COLLECTION_ACCOUNT;
      var pass = process.env.MOMO_PASSWORD_COLLECTION_ACCOUNT;
      const sub_key = process.env.SUB_KEY_COLLECTION_ACCOUNT;

      const dataV = await axios.post(
        session_url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": sub_key
          },
          auth: {
            username: uname,
            password: pass
          }
        }
      );

      const access_token = dataV.data.access_token;

      var session_url = `https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay/${referenceId}`;

      axios
        .get(session_url, {
          headers: {
            "X-Target-Environment": "mtnzambia",

            "Ocp-Apim-Subscription-Key": sub_key,
            Authorization: "Bearer " + access_token
          }
        })
        .then(async Response => {
          console.log(Response.data);

          if (Response.data.status == "FAILED") {
            console.log("pamatako");

            //CREATE FAILED TRANSACTION
            const failedTransaction = new FailedTransaction({
              txnId: pendingPayments.txnId,
              amount: pendingPayments.amount,
              sender: pendingPayments.sender,
              receiver: pendingPayments.receiver,
              provider: pendingPayments.provider,
              providertransactionId: pendingPayments.txnId,
              transactionType: pendingPayments.transactionType,
              status: "FAILED",
              reason: Response.data.reason
            });

            console.log(failedTransaction);
            //SAVE FAILED TRANSACTION TO DATABASE
            await failedTransaction.save();
            console.log("FAILED PAYMENT SAVED");

            //DEFAULT VARIABLES
            const transactionID = pendingPayments.txnId;
            const date = Date.now();
            const transactionDtate = new Date(date);
            const amount = failedTransaction.amount;
            const sender = failedTransaction.sender;

            //DELETE PENDING PAYMENT
            await PendingPayments.findByIdAndDelete(pendingPayments._id);
            console.log("PENDING PAYMENT DELETED");

            const message =
              `Transaction failed. ZMW ${amount} from ${sender} at` +
              ` ${transactionDtate}` +
              ` TXT ID:${transactionID}`;

            //SMS RECEIVER OF FAILED TRANSACTION
            const zamtelKey = process.env.ZAMTEL_KEY;
            var session_url = `https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key/${zamtelKey}/contacts/${pendingPayments.receiver}/senderId/ZatuWallet/message/${message}`;

            const smsStatus = await axios.get(session_url);

            if (smsStatus.status == 202) {
              //FAILED SMS
            }
          } else if (Response.data.status == "SUCCESSFUL") {
            //CREATE SUCCESSFUL TRANSACTION
            const sucessfulTransaction = new SucessfulTransaction({
              transactionType: pendingPayments.transactionType,
              txnId: pendingPayments.txnId,
              amount: pendingPayments.amount,
              sender: pendingPayments.sender,
              receiver: pendingPayments.receiver,
              provider: pendingPayments.provider,
              providertransactionId: pendingPayments.txnId,
              status: "SUCCESSFUL"
            });

            //SAVE SUCCESSFUL TRANSACTION TO DATABASE
            await sucessfulTransaction.save();
            console.log("SUCCESSFULL PAYMENT SAVED");

            //GET RECEIVER DETAILS
            const receiverDetails = await User.find({
              phoneNumber: pendingPayments.receiver
            });

            const receiverMomo = receiverDetails[0];

            const receiverRemaining =
              receiverMomo.balance + parseInt(pendingPayments.amount);

            //UPDATE RECEIVERS ACCOUNT
            const receiverTransfer = await User.updateOne(
              { phoneNumber: pendingPayments.receiver },
              { $set: { balance: receiverRemaining } }
            );

            //DEFAULT VARIABLES
            const transactionID = pendingPayments.txnId;
            const date = Date.now();
            const transactionDtate = new Date(date);
            const amount = sucessfulTransaction.amount;
            const receiver = sucessfulTransaction.receiver;

            //DELETE PENDING PAYMENT
            await PendingPayments.findByIdAndDelete(pendingPayments._id);

            const message = `You have received ZMW ${amount} from ${sender} at ${transactionDtate}. TXT ID:${transactionID}`;

            //SMS RECEIVER OF SUCCESSFUL TRANSACTION
            const zamtelKey = process.env.ZAMTEL_KEY;
            var session_url = `https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key/${zamtelKey}/contacts/${receiver}/senderId/ZatuWallet/message/${message}`; //encodeURIComponent();

            const smsStatus = await axios.get(session_url);

            console.log(smsStatus);

            if (smsStatus.status == 202) {
            }
          }
        })
        .catch(error => {
          console.log(error);
        });

      console.log("MTN TRANSACTION FOUND");
    } else if (pendingPayments.transactionType == "DISBURSEMENT") {
      //TRANSFER(check transaction status of transfer transaction)
      //GENERATE TOKEN MOMO
      var session_url_ = "https://proxy.momoapi.mtn.com/disbursement/token/";

      var uname = process.env.MOMO_USER_NAME_DISBURSEMENT_ACCOUNT;
      var pass = process.env.MOMO_PASSWORD_DISBURSEMENT_ACCOUNT;
      const sub_key = process.env.SUB_KEY_DISBURSEMENT_ACCOUNT;

      axios
        .post(
          session_url_,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": sub_key
            },
            auth: {
              username: uname,
              password: pass
            }
          }
        )
        .then(async (response) => {
          //console.log(response);
          //TOKEN
          const token = response.data.access_token;

          var session_url = `https://proxy.momoapi.mtn.com/disbursement/v1_0/transfer/${pendingPayments.txnId}`;

        const result = await  axios.get(session_url, {
            headers: {
              "X-Target-Environment": "mtnzambia",

              "Ocp-Apim-Subscription-Key": sub_key,
              Authorization: "Bearer " + token
            }
          });

          return result;
        })
        .then(async (response) => {
          console.log(response);
          if (response.data.status != 202) {
            console.log("Transaction failed: DISBURSEMENT FAILED");
            response.data;
             //CREATE FAILED TRANSACTION
             const failedTransaction = new FailedTransaction({
              txnId: pendingPayments.txnId,
              amount: pendingPayments.amount,
              sender: pendingPayments.sender,
              receiver: pendingPayments.receiver,
              provider: pendingPayments.provider,
              providertransactionId: pendingPayments.txnId,
              transactionType: pendingPayments.transactionType,
              status: "FAILED",
              reason: response.data.reason
            });

            console.log(failedTransaction);
            //SAVE FAILED TRANSACTION TO DATABASE
            await failedTransaction.save();
            console.log("FAILED DISBURSEMENT SAVED");

            //DEFAULT VARIABLES
            const transactionID = pendingPayments.txnId;
            const date = Date.now();
            const transactionDtate = new Date(date);
            const amount = failedTransaction.amount;
            const sender = failedTransaction.sender;

            //DELETE PENDING PAYMENT
            await PendingPayments.findByIdAndDelete(pendingPayments._id);
            console.log("PENDING DISBURSEMENT DELETED");

            return;
          } else if (response.status == 200) {
            //CREATE SUCCESSFUL TRANSACTION
            const sucessfulTransaction = new SucessfulTransaction({
              transactionType: pendingPayments.transactionType,
              txnId: pendingPayments.txnId,
              amount: pendingPayments.amount,
              sender: pendingPayments.sender,
              receiver: pendingPayments.receiver,
              provider: pendingPayments.provider,
              providertransactionId: pendingPayments.txnId,
              status: "SUCCESSFUL"
            });

            //SAVE SUCCESSFUL TRANSACTION TO DATABASE
            await sucessfulTransaction.save();
            console.log("SUCCESSFULL DISBURSEMENT SAVED");

            //DELETE PENDING PAYMENT
            await PendingPayments.findByIdAndDelete(pendingPayments._id);
            console.log("PENDING PAYMENT DELETED");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  } else if (pendingPayments.provider === 3) {
    //ZAMTEL PENDING PAYMENTS
    console.log("ZAMTEL TRANSACTION FOUND");
  }
};

module.exports = resolveTransaction;
