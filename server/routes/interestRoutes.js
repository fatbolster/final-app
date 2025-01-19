const express = require('express');
const { scrapeFixedDepositRates } = require('../controllers/interestController');

const router = express.Router();


router.get('/fixed-deposit-rates', scrapeFixedDepositRates);

module.exports = router;
