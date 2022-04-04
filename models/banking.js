const { status } = require("express/lib/response");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const customerAccountSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    accountNumber: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
    from: {
        type: ObjectId,
        ref: "customerAccount",
        required: true
    },
    to: {
        type: ObjectId,
        ref: "customerAccount",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "success", "failed"]
    },
    created: {
        type: Date,
        required: true
    }
}, {timestamps: true});

const CustomerAccount = mongoose.model("customerAccount", customerAccountSchema);
const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = {CustomerAccount, Transaction}