const express = require('express');
const { addOrUpdateExpenditure, getExpenditures, deleteTransaction } = require('../controllers/expenditureController');
const router = express.Router();

// Add or Update an expenditure
router.post('/update', addOrUpdateExpenditure);

// Get expenditures (with optional month filter)
router.get('/get', getExpenditures);
router.post('/delete', deleteTransaction);

module.exports = router;
