const mongoose = require("mongoose");

const walletAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    balance: {
        type: Number,
        // default: 1000,
        required: true,
    }
})

const Account = mongoose.model("Account", walletAccountSchema);
module.exports = Account;