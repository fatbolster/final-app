const express = require('express');
const { analyzeSpending } = require('../controllers/chatGPTcontroller');

const router = express.Router();


router.post('/analyze', analyzeSpending);

module.exports = router;
