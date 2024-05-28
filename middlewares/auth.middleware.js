const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.authZ = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(404).json({
            success: false,
            message: "Token Not Found",
        })
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        if(decoded.userID) {
            req.userID = decoded.userID;
            next();
        }
    } catch(err) {
        return res.status(403).json({
            success: false,
            message: "Error while verifying User",
        })
    }
}