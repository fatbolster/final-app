const express = require("express");
const { updateUserIncome, retrieveUser } = require("../controllers/userController");
const router = express.Router();


router.put("/update-income", updateUserIncome);


router.get("/retrieve", retrieveUser);

module.exports = router;
