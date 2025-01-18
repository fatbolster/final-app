const express = require('express');
const { updateUser, initializeUser } = require('../controllers/userController');

const router = express.Router();

// Initialize user details (only needed once)
router.post('/initial', initializeUser);

// Update user details
router.put('/update', updateUser);

module.exports = router;
