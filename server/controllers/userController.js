const User = require('../models/userModel');


const updateUserIncome = async (req, res) => {
    const { ageGroup, incomeHistory, targetSavings } = req.body;
  
 
    const { month, monthlyIncome } = incomeHistory;
  
    try {
  
      let user = await User.findOne();
  
      if (!user) {
       
        user = new User({
          ageGroup,
          incomeHistory: [{ month, monthlyIncome }],
          targetSavings,
        });
      } else {
   
        user.ageGroup = ageGroup;
        user.targetSavings = targetSavings;
  
      
        const existingIncome = user.incomeHistory.find(
          (entry) => entry.month === month
        );
  
        if (existingIncome) {
          existingIncome.monthlyIncome = monthlyIncome; 
        } else {
          user.incomeHistory.push({ month, monthlyIncome }); 
        }
      }
  
    
      await user.save();
  
      res.status(200).json({ message: "User data updated successfully", user });
    } catch (error) {
      console.error("Error updating user data:", error);
      res.status(500).json({ error: "Failed to update user data" });
    }
  };
  


  const retrieveUser = async (req, res) => {
    try {

      const user = await User.findOne();
  
      console.log("Fetched User from Database:", user); 
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
     
      res.status(200).json({
        ageGroup: user.ageGroup,
        incomeHistory: user.incomeHistory, 
        currentSavings: user.currentSavings, 
        targetSavings: user.targetSavings,
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

