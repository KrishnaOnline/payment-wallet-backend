const mongoose = require("mongoose");

const dbConnect = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL).then(
            () => console.log("DB Connection: SUCCESS")
        )
    } catch(err) {
        console.log("DB Connection: FAILED", err);
    }
}

module.exports = dbConnect;