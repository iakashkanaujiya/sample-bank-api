const User = require("../models/user");
const Vonage = require('@vonage/server-sdk')

// Vonage object
// Vonage API to send the sms to the user's phone
const vonage = new Vonage({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET
});

// Registet the user
exports.resgiterUser = (req, res) => {
    // user's name, email and phone
    const { phone } = req.body;

    // Find the user, if already exists
    // Check the user's email and phone both
    User.findOne({ phone }).exec((err, user) => {
        // if there is an error
        if (err) {
            console.log(err);
            return res.status(500).json({ "error": "Opps! Something went wrong" });
        }

        // when user already exists
        if (!!user) {
            return res.status(200).json({ "message": "Email or Phone is already register, Please Login!" });
        }

        // when user not exists in the database
        if (!user) {
            // Generate verficiation code
            // Save the verification code into DB
            // To verfiy the user
            var otp = Math.floor(Math.random() * (1000 - 9999) + 9999);

            // Create new User Document
            var user = User({ ...req.body, otp, account: req.customerAccount._id });

            // Save the user in the database
            user.save((err, doc) => {
                // handle the error
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        "error": "Opps! Something went wrong to save the user in Database"
                    });
                }

                if (doc) {
                    const from = "Vonage APIs";
                    const to = phone;
                    const text = `Your verficiation code is ${doc.otp}`;

                    //Send the verficiation code to the user's phone via SMS
                    vonage.message.sendSms(from, to, text, (err, response) => {
                        // Check the error
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                "error": "Opps! Something went wrong to send the OTP"
                            });
                        }
                        // on success
                        if (response) {
                            return res.status(200).json({
                                "message": "Successfully registered!",
                                "_id": doc._id 
                            });
                        }
                    });
                }
            });
        }
    });
};

// Login the user
exports.loginUser = (req, res) => {
    const phone = req.body.phone;
    // Generate verficiation code
    // Save the verification code into DB
    // To verfiy the user
    var otp = Math.floor(Math.random() * (1000 - 9999) + 9999);

    User.findOneAndUpdate({ phone }, { otp }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ "error": "User doesn't exists, Please register" });
        }

        // When doc is available
        if (!!user) {
            const from = "Vonage APIs";
            const to = phone;
            const text = `Your verficiation code is ${otp}`;

            //Send the verficiation code to the user's phone via SMS
            vonage.message.sendSms(from, to, text, (err, response) => {
                // Check the error
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        "error": "Opps! Something went wrong to send the OTP"
                    });
                }
                // on success
                if (response) {
                    return res.status(200).json({
                        "message": "Successfully Logged In!",
                        "_id": user._id
                    });
                }
            });
        }
    });
};

// Verify user via OTP
exports.verifyUserViaOtp = (req, res) => {
    const { phone, otp } = req.body;

    // Find the user
    User.findOne({ phone }, (err, user) => {
        if (err || !user) {
            return res.status(500).json({ "error": "Opps! Something went wrong to find the user in database" });
        }

        if (!!user) {
            // Validate the OTP
            if (user.otp == parseInt(otp)) {
                // Update the user status
                User.findOneAndUpdate({ phone }, { otp: 0, active: true }, (err) => {
                    if (err) {
                        return res.status(500).json({ "error": "Opps! Something went wrong" });
                    } else {
                        return res.status(200).json({ "message": "Successfully verified" });
                    }
                });
            } else {
                return res.status(401).json({ "error": "Wrong OTP" });
            }
        }
    });
};