const express = require("express");
const { updateUserIncome, retrieveUser } = require("../controllers/userController");
const router = express.Router();

// PUT: Update user income (add/replace income for a specific month)
router.put("/update-income", updateUserIncome);

// GET: Retrieve user data
router.get("/retrieve", retrieveUser);

module.exports = router;
