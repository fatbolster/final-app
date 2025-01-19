const express = require('express');
const { addOrUpdateExpenditure, getExpenditures, deleteTransaction } = require('../controllers/expenditureController');
const router = express.Router();


router.post('/update', addOrUpdateExpenditure);


router.get('/get', getExpenditures);
router.post('/delete', deleteTransaction);

module.exports = router;
