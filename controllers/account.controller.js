const { default: mongoose } = require("mongoose");
const Account = require("../models/account.model");
const User = require("../models/user.model");

exports.transferMoney = async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        const {amount, to} = req.body;
        if(!amount) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Please Enter Amount > 0",
            })
        }
        const fromAccount = await Account.findOne({user: req.userID})
                                         .session(session);
        if(!fromAccount || fromAccount.balance<amount) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Insufficient Balance or From User Don't exists",
            })
        }
        const toAccount = await Account.findOne({user: to})
                                       .session(session);
        if(!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "To User Don't Exists",
            })
        }
        await Account.updateOne(
            {user: req.userID},
            {$inc: {balance: -amount}},
            {new: true}
        ).session(session);
        await Account.updateOne(
            {user: to},
            {$inc: {balance: amount}},
            {new: true}
        ).session(session);
        await session.commitTransaction();
        // await session.endSession();
        return res.status(200).json({
            success: true,
            message: "Transaction Successful",
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}