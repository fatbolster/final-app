const express = require('express');
const { scrapeFixedDepositRates } = require('../controllers/interestController');

const router = express.Router();

// Define the route
router.get('/fixed-deposit-rates', scrapeFixedDepositRates);

module.exports = router;
