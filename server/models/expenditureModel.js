const mongoose = require('mongoose');

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    dateLogged: { type: String, required: true }, // Date the transaction was logged
    amount: { type: Number, required: true }, // Transaction amount
    description: { type: String, required: true }, // Description of the transaction
});

// Allocation Schema (now includes transactions)
const allocationSchema = new mongoose.Schema({
    category: { type: String, required: true }, // Spending category (e.g., "Food", "Lifestyle")
    transactions: [transactionSchema], // Array of transaction objects
});

// Expenditure Schema
const expenditureSchema = new mongoose.Schema({
    month: { type: String, required: true }, // e.g., "2025-01"
    allocation: [allocationSchema], // Array of categories, each with transactions
});

module.exports = mongoose.model('Expenditure', expenditureSchema);
