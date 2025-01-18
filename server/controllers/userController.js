const User = require('../models/userModel');

// Update user details (single user account)
const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            {}, // Match the single document
            { $set: req.body }, // Update the fields sent in the request
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Respond with only the essential fields
        res.status(200).json({
            name: updatedUser.name,
            monthlyBudget: updatedUser.monthlyBudget,
            targetNetWorth: updatedUser.targetNetWorth,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Initialize user details (only needed once)
const initializeUser = async (req, res) => {
    try {
        const { name, monthlyBudget, targetNetWorth } = req.body;

        // Check if a user already exists
        const existingUser = await User.findOne();
        if (existingUser) {
            return res.status(400).json({ message: 'User already initialized' });
        }

        // Create a new user
        const newUser = new User({ name, monthlyBudget, targetNetWorth });
        const savedUser = await newUser.save();

        // Respond with only the essential fields
        res.status(201).json({
            name: savedUser.name,
            monthlyBudget: savedUser.monthlyBudget,
            targetNetWorth: savedUser.targetNetWorth,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing user', error: error.message });
    }
};

module.exports = {
    updateUser,
    initializeUser,
};
