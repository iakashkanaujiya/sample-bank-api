const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 10
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 10
    },
    email: {
        type: String,
        required: true,
        maxLength: 50,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    account: {
        type: ObjectId,
        ref: "customerAccount",
        required: true
    },
    otp: {
        type: Number,
        maxLength: 4,
        default: 0000
    },
    active: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

