const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // User's name
        },
        monthlyBudget: {
            type: Number,
            required: true, // Monthly budget in numbers
            default: 0, // Default budget is 0
        },
        targetNetWorth: {
            type: Number,
            required: true, // Target net worth in numbers
            default: 0, // Default target net worth is 0
        },
        ageGroup: {
            type: String, 
            required: false, 
            default: 0 
        },
        monthlyIncome: {
            type: Number, 
            required: true, 
            default: 0 
        }
    }
);

module.exports = mongoose.model('User', userSchema);
