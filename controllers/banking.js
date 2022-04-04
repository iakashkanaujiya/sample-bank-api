const request = require("request");
const { CustomerAccount, Transaction } = require("../models/banking");

// Create customer Account
exports.createAccount = (req, res) => {
    const { accountNumber } = req.body;

    // Find account if already exists
    CustomerAccount.findOne({ accountNumber }, (err, doc) => {
        if (err) {
            return res.status(500).json({ "error": "There was an error to process the request" });
        }

        // When theres is an existing account
        if (!!doc) {
            return res.status(200).json({ "message": "Account number already exists" });
        }

        // Create new account
        if (!doc) {
            const customerAccount = CustomerAccount(req.body);

            customerAccount.save((err, doc) => {
                if (err) {
                    return res.status(500).json({ "error": "There was an error to create an account" });
                }
                if (!!doc) {
                    return res.status(200).json({
                        "message": "Account created Successfully",
                        "account": doc
                    })
                };
            });
        }
    });

};

// Get the Customer by Account Number
exports.getCustomerAccountByAccountNumber = (req, res, next) => {
    const { accountNumber } = req.body;

    CustomerAccount.findOne({ accountNumber }, (err, doc) => {
        if (err || !doc) {
            return res.status(500).json({ "error": "No, Account number exists" });
        }

        req.customerAccount = doc;
        next();
    });
};

// Get Customer Account info
exports.getCustomerAccount = (req, res) => {
    req.customerAccount.createdAt = undefined;
    req.customerAccount.updatedAt = undefined;
    req.customerAccount.__v = undefined;

    return res.status(200).json(req.customerAccount);
};

// Verify Beneficiary
exports.verifyBeneficiary = (req, res) => {
    return res.status(200).json({
        "message": "Beneficiary account exists",
        "account": {
            "accountNumber": req.customerAccount.accountNumber,
            "firstName": req.customerAccount.firstName,
            "lastName": req.customerAccount.lastName,
            "fullName": req.customerAccount.fullName,
            "DOB": req.customerAccount.dob
        }
    });
}

// Get all the customers account details
exports.getAllCustomerAccounts = (req, res) => {
    CustomerAccount.find().exec((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ "error": "Something went wrong to process the request" });
        }

        return res.status(200).json(docs);
    });
};

// Get exchange rate
exports.getExchangeRate = (req, res) => {
    const { currency } = req.query;

    if (currency !== "INR") {
        return res.status(200).json({ "message": `No exchnage rate available for the ${currency}` });
    }

    return res.status(200).json({
        "message": {
            currency,
            "exchange_rate": "2.25"
        }
    })
};

// Initate Transaction
exports.initateTransaction = (req, res, next) => {
    const transaction = Transaction({
        from: req.user.account._id,
        to: req.customerAccount._id,
        amount: req.body.amount,
        status: "pending",
        created: Date()
    });

    transaction.save((err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ "error": "Something went wrong to process the request" });
        }

        req.transaction = doc;
        next();
    })
};

//Create Transaction
exports.createTransaction = (req, res, next) => {

    // Acount details of the customer whose amount will be transferred
    const { accountNumber, amount } = req.body;

    var remainingAmount = req.user.account.balance - amount;
    var totalAmount = req.customerAccount.balance + amount;

    // Update the Sender account balance
    CustomerAccount.findByIdAndUpdate(
        req.user.account._id,
        { "balance": remainingAmount },
        (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ "error": "Something went wrong to process the request" });
            }

            //Update the beneficiary account balance
            CustomerAccount.findOneAndUpdate(
                { accountNumber },
                { "balance": totalAmount },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ "error": "Something went wrong to process the request" });
                    }
                    // Pass to next
                    next();
                }
            );
        }
    );

};

// Complete Transaction
exports.completeTransaction = (req, res) => {
    const from = req.user;
    const to = req.customerAccount;
    const transaction = req.transaction;

    req.transaction.status = "success";
    req.transaction.save((err, doc) => {
        if (err) {
            return res.status(500).json({
                "error": "There was an error to complete the transaction"
            })
        }

        return res.status(200).json({
            "message": "Amount successfully transferred",
            "transaction": transaction
        });

    });
};

// Get all the transaction
exports.getAllTransaction = (req, res) => {
    Transaction.find().populate(["from", "to"]).exec((err, docs) => {
        if (err) {
            return res.status(500).json({ "error": "There was an error to process the request" });
        }

        return res.status(200).json(docs);
    });
}

// Generate QR
exports.generateQr = (req, res) => {

    const { accountNumber, fullName, amount } = req.body;

    const options = {
        method: "POST",
        url: "https://api.qr-code-generator.com/v1/create?access-token=M420kvF-NeMPeM3Y2C2_EurGOX7NdG09jdzbd73E6QnzH57kdkujknlag2SQatg3&",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "frame_name": "no-frame",
                "qr_code_text": `${process.env.URL}/api/banking/qr-payment?account_number=${accountNumber}&full_name=${fullName}&amount=${amount}`,
                "image_format": "SVG",
                "qr_code_logo": "scan-me-square"
            }
        )
    }

    request(options, (err, response, body) => {
        res.format({
            "image/svg+xml": () => {
                res.status(200).send(body);
            }
        });
    })
};

// QR payment
exports.qrPayment = (req, res, next) => {
    const { account_number, full_name, amount } = req.query;

    req.body.accountNumber = account_number;
    req.body.fullName = full_name;
    req.body.amount = parseInt(amount);

    next();

};



