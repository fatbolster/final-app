const Expenditure = require('../models/expenditureModel');

const addOrUpdateExpenditure = async (req, res) => {
    try {
        const { month, allocation } = req.body;

        // Validate input
        if (!month || !allocation || !Array.isArray(allocation)) {
            return res.status(400).json({ message: 'Month and allocation are required' });
        }

        // Check if the month already exists
        const existingExpenditure = await Expenditure.findOne({ month });
        if (existingExpenditure) {
            // Update the existing expenditure
            existingExpenditure.allocation = allocation;
            const updatedExpenditure = await existingExpenditure.save();
            return res.status(200).json(updatedExpenditure);
        }

        // Create a new expenditure
        const newExpenditure = new Expenditure({ month, allocation });
        const savedExpenditure = await newExpenditure.save();
        res.status(201).json(savedExpenditure);
    } catch (error) {
        res.status(500).json({ message: 'Error adding or updating expenditure', error: error.message });
    }
};

// Get Expenditures
const getExpenditures = async (req, res) => {
    try {
        const { month } = req.query;

        const query = month ? { month } : {};
        const expenditures = await Expenditure.find(query);

        res.status(200).json(expenditures);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenditures', error: error.message });
    }
};

module.exports = {
    addOrUpdateExpenditure,
    getExpenditures
};
