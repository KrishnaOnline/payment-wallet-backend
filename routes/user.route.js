const express = require("express");
const router = express.Router();
const {signUp, logIn, getUserDetails, getBySearch, getBalance} = require("../controllers/user.controller");
const { authZ } = require("../middlewares/auth.middleware");

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/user-details", authZ, getUserDetails);
router.get("/search-results", getBySearch);
router.get("/balance", authZ, getBalance);

module.exports = router;