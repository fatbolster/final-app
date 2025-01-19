const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
    dateLogged: { type: String, required: true },
    amount: { type: Number, required: true }, 
    description: { type: String, required: true },
});


const allocationSchema = new mongoose.Schema({
    category: { type: String, required: true }, 
    transactions: [transactionSchema], 
});

const expenditureSchema = new mongoose.Schema({
    month: { type: String, required: true },
    allocation: [allocationSchema], 
});

module.exports = mongoose.model('Expenditure', expenditureSchema);
