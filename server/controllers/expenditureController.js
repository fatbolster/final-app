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
            console.log("Existing expenditure found for month:", month);

            // Loop through the incoming allocation categories
            allocation.forEach((incomingCategory) => {
                const existingCategory = existingExpenditure.allocation.find(
                    (cat) => cat.category === incomingCategory.category
                );

                if (existingCategory) {
                    // If category exists, extend its transactions
                    console.log(`Extending transactions for category: ${incomingCategory.category}`);
                    existingCategory.transactions.push(...incomingCategory.transactions);
                } else {
                    // If category does not exist, add it as a new category
                    console.log(`Adding new category: ${incomingCategory.category}`);
                    existingExpenditure.allocation.push(incomingCategory);
                }
            });

            // Save the updated expenditure document
            const updatedExpenditure = await existingExpenditure.save();
            return res.status(200).json(updatedExpenditure);
        }

        // If the month does not exist, create a new expenditure document
        console.log("Creating a new expenditure document for month:", month);
        const newExpenditure = new Expenditure({ month, allocation });
        const savedExpenditure = await newExpenditure.save();
        return res.status(201).json(savedExpenditure);
    } catch (error) {
        console.error("Error in addOrUpdateExpenditure:", error);
        return res.status(500).json({ message: 'Error adding or updating expenditure', error: error.message });
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
