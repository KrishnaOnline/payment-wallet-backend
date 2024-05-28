const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const PORT = process.env.PORT || 3000;
const mainRouter = require("./routes/index");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());
// app.use(
//     cors({
//         origin: "https://payment-wallet-kv.vercel.app",
//         credentials: true,
//     })
// );

dbConnect();

app.use("/api", mainRouter);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Server is Up and Running..."
    });
})

app.listen(PORT, () => {
    console.log(`Server is Running at ${PORT}`);
})