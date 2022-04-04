const User = require("../models/user");

// Get the user By Id
exports.getUserById = (req, res, next) => {
    const { userId } = req.params;
    
    User.findById({_id: userId}).populate("account").exec((err, doc) => {
        if (err || !doc) {
            return res.status(401).json({ "error": "No user found" });
        }

        req.user = doc;
        next();
    });
};

// Get user
exports.getUser = (req, res) => {
    req.user.createdAt = undefined;
    req.user.updatedAt = undefined;
    req.user.active = undefined;
    req.user.otp = undefined;
    req.user.__v = undefined;
    return res.status(200).json(req.user);
};