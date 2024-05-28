const User = require("../models/user.model");
const Account = require("../models/account.model");
const jwt = require("jsonwebtoken");
const z = require("zod");
const bcrypt = require("bcryptjs");

const signUpSchema = z.object({
    username: z.string().min(2).refine(u => !u.includes(" "), "No Spaces in Username"),
    mobileNo: z.string().length(10),
    email: z.string().email(),
    password: z.string().min(3),
})

exports.signUp = async (req, res) => {
    try {
        const {success} = signUpSchema.safeParse(req.body);
        if(!success) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Input",
            })
        }
        const {name, username, mobileNo, email, password} = req.body;
        const user = await User.findOne({username});
        if(user) {
            return res.status(400).json({
                success: false,
                message: "User with this username already Exists",
            })
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, 
            username, 
            mobileNo,
            email, 
            password: hashedPass, 
        })
        // const token = jwt.sign({
        //     userID: newUser._id,
        // }, process.env.JWT_SECRET);
        const account = await Account.create({
            user: newUser._id,
            balance: 1500,
        })
        newUser.account = account._id;
        newUser.save();
        const userData = await User.findById(newUser._id)
            .populate({
                path: 'account',
                select: 'balance',
            });
        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            // token,
            // data: userData,
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.logIn = async (req, res) => {
    try {
        const {success} = signUpSchema.pick({username: true, password: true}).safeParse(req.body);
        if(!success) {
            return res.status(400).json({
                success: false,
                message: "Invalid Inputs",
            })
        }
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User Don't Exists",
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(403).json({
                success: false,
                message: "Incorrect Password",
            })
        }
        const token = jwt.sign({
            userID: user._id,
        }, process.env.JWT_SECRET);
        user.token = token;
        const userData = await User.findById(user._id)
            .populate({
                path: 'account',
                select: 'balance',
            });
        return res.header("Authorization", "Bearer "+token).status(200).json({
            success: true,
            message: "User Logged In",
            token,
            data: userData,
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.getUserDetails = async (req, res) => {
    try {
        if(!req.userID) {
            return res.status(400).json({
                success: false,
                message: "Please enter UserID",
            })
        }
        const user = await User.findById(req.userID)
                                    .populate({
                                        path: 'account',
                                        select: 'balance',
                                    });
        // console.log(user);
        res.status(200).json({
            success: true,
            message: "Fetched User Details",
            data: user,
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.getBySearch = async (req, res) => {
    try {
        const filter = req.query.filter || "";
        const users = await User.find({
            $or: [{
                name: {$regex: filter}
            }, {
                mobileNo: {$regex: filter}
            }, {
                username: {$regex: filter}
            }]
        })
        res.status(200).json({
            success: true,
            message: "Users By Search",
            data: users.map(user => ({
                name: user.name,
                username: user.username,
                mobileNo: user.mobileNo,
                _id: user._id,
            }))
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.getBalance = async (req, res) => {
    try {
        const account = await Account.findOne({
            user: req.userID,
        });
        console.log(account);
        res.status(200).json({
            success: true,
            message: "Fetched Balance",
            balance: account.balance,
        })
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}