const express = require("express");
const router = express.Router();
const {transferMoney} = require("../controllers/account.controller");
const { authZ } = require("../middlewares/auth.middleware");

router.post("/transfer", authZ, transferMoney);

module.exports = router;