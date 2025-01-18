const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {   ageGroup: {
        type: String, 
        required: false, 
        default: 0 
    },
        
    monthlyIncome: {
        type: Number, 
        required: true, 
        default: 0 
    },
    targetSavings: {
        type: Number,
        required: true, // Target net worth in numbers
        default: 0, // Default target net worth is 0
    }, monthlyBudget: {
        type: Number,
        required: true, // Monthly budget in numbers
        default: 0, // Default budget is 0
    }, 
        name: {
            type: String,
            required: false, // User's name
        }
        
    }
);

module.exports = mongoose.model('User', userSchema);
