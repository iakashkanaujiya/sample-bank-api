const express = require("express");
const router = express.Router();
const { resgiterUser, loginUser, verifyUserViaOtp } = require("../controllers/auth");
const {getCustomerAccountByAccountNumber} = require("../controllers/banking");

// Auth routes
router.post("/register", getCustomerAccountByAccountNumber, resgiterUser);
router.post("/login", loginUser);
router.post("/otp-verify", verifyUserViaOtp);

module.exports = router;