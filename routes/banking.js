const express = require("express");
const router = express.Router();
const {
    createAccount,
    getCustomerAccountByAccountNumber,
    getCustomerAccount,
    getExchangeRate,
    verifyBeneficiary,
    createTransaction,
    initateTransaction,
    completeTransaction,
    getAllTransaction,
    getAllCustomerAccounts,
    generateQr,
    qrPayment } = require("../controllers/banking");
const { getUserById } = require("../controllers/user");

// Requests
router.post("/create-account", createAccount);
router.post("/account", getCustomerAccountByAccountNumber, getCustomerAccount);
router.get("/exchange-rate", getExchangeRate);
router.post("/verify-beneficiary", getCustomerAccountByAccountNumber, verifyBeneficiary);
router.get("/all-accounts", getAllCustomerAccounts);

// Generate QR
router.post("/generate-qr", generateQr);

// Transaction
router.get("/qr-payment/:userId",
    getUserById,
    qrPayment,
    getCustomerAccountByAccountNumber,
    initateTransaction,
    createTransaction,
    completeTransaction);

router.post("/create-transaction/:userId",
    getUserById,
    getCustomerAccountByAccountNumber,
    initateTransaction,
    createTransaction,
    completeTransaction);

router.get("/transaction-history", getAllTransaction);


module.exports = router;