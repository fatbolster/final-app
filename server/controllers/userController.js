const User = require('../models/userModel');

// Update user details (single user account)
const updateUserIncome = async (req, res) => {
    const { ageGroup, incomeHistory, targetSavings } = req.body;
  
    // Ensure incomeHistory is properly structured
    const { month, monthlyIncome } = incomeHistory;
  
    try {
      // Find the user (assuming a single user for now)
      let user = await User.findOne();
  
      if (!user) {
        // Create a new user if none exists
        user = new User({
          ageGroup,
          incomeHistory: [{ month, monthlyIncome }], // Initialize with incomeHistory
          targetSavings,
        });
      } else {
        // Update existing user details
        user.ageGroup = ageGroup;
        user.targetSavings = targetSavings;
  
        // Update or add incomeHistory
        const existingIncome = user.incomeHistory.find(
          (entry) => entry.month === month
        );
  
        if (existingIncome) {
          existingIncome.monthlyIncome = monthlyIncome; // Update salary for the month
        } else {
          user.incomeHistory.push({ month, monthlyIncome }); // Add new month to incomeHistory
        }
      }
  
      // Save the updated or newly created user
      await user.save();
  
      res.status(200).json({ message: "User data updated successfully", user });
    } catch (error) {
      console.error("Error updating user data:", error);
      res.status(500).json({ error: "Failed to update user data" });
    }
  };
  


  const retrieveUser = async (req, res) => {
    try {
      // Find a single user
      const user = await User.findOne();
  
      console.log("Fetched User from Database:", user); // Log user data for debugging
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Return user data with only the necessary fields
      res.status(200).json({
        ageGroup: user.ageGroup,
        incomeHistory: user.incomeHistory, // Include income history
        currentSavings: user.currentSavings, // Include current savings
        targetSavings: user.targetSavings, // Include target savings
      });
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ message: "Error retrieving user", error: error.message });
    }
  };
  


module.exports = {
    updateUserIncome, 
    retrieveUser
};

